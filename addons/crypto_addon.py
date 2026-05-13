"""mitmproxy addon - 加解密网关（根据匹配规则的 action 决定加密或解密）"""
import sys
import os
import json
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mitmproxy import http


class CryptoAddon:
    def __init__(self):
        self._crypto = None
        self._gw_config = None

    def _init_services(self):
        if self._crypto is None:
            from core.crypto_service import GatewayCryptoService
            config_file = os.environ.get("ENDE_CONFIG_FILE", "")
            if config_file and os.path.exists(config_file):
                with open(config_file, "r", encoding="utf-8") as f:
                    self._gw_config = json.load(f)
            else:
                self._gw_config = {}
            self._crypto = GatewayCryptoService(self._gw_config)

    def request(self, flow: http.HTTPFlow):
        self._init_services()
        self._process(flow, phase="request")

    def response(self, flow: http.HTTPFlow):
        if not flow.response or not flow.response.content:
            return
        self._init_services()
        self._process(flow, phase="response")

    def _process(self, flow: http.HTTPFlow, phase: str):
        from core.match_engine import find_matching_rules

        rules = self._gw_config.get("match_rules", [])
        if not rules:
            return

        req_body = flow.request.content.decode("utf-8", errors="replace") if flow.request.content else ""
        resp_body = ""
        if flow.response and flow.response.content:
            resp_body = flow.response.content.decode("utf-8", errors="replace")

        query_params = dict(flow.request.query or {})

        flow_data = {
            "request_headers": dict(flow.request.headers),
            "request_body": req_body,
            "response_body": resp_body,
            "query_params": query_params,
        }

        matched = find_matching_rules(rules, flow_data)
        if not matched:
            return

        for rule in matched:
            action = rule["action"]
            target = rule["target"]
            prefix = rule.get("wrapper_prefix", "")
            suffix = rule.get("wrapper_suffix", "")
            algo = rule.get("algorithm", "")
            algo_params = rule.get("algorithm_params", {})
            hash_cfg = rule.get("hash_config", {})

            if target == "chain":
                self._process_chain(flow, rule, phase)
                continue

            if action == "encrypt":
                if target == "query_param_all" and phase == "request":
                    self._encrypt_query_params(flow, None, prefix, suffix, algo, algo_params, hash_cfg)
                elif target == "query_param" and phase == "request":
                    self._encrypt_query_params(flow, rule.get("param_name", ""), prefix, suffix, algo, algo_params, hash_cfg)
                elif phase == "request" and target in ("request_body", "request_header"):
                    self._encrypt_body(flow, "request", prefix, suffix, algo, algo_params, hash_cfg)
                elif phase == "response" and target == "response_body":
                    self._encrypt_body(flow, "response", prefix, suffix, algo, algo_params, hash_cfg)
                elif phase == "response" and target == "response_json_field":
                    self._process_json_field(flow, rule, rule["action"])
            elif action == "decrypt":
                if target == "query_param_all" and phase == "request":
                    self._decrypt_query_params(flow, None, prefix, suffix, algo, algo_params)
                elif target == "query_param" and phase == "request":
                    self._decrypt_query_params(flow, rule.get("param_name", ""), prefix, suffix, algo, algo_params)
                elif phase == "request" and target in ("request_body", "request_header"):
                    self._decrypt_body(flow, "request", prefix, suffix, algo, algo_params)
                elif phase == "response" and target == "response_body":
                    self._decrypt_body(flow, "response", prefix, suffix, algo, algo_params)
                elif phase == "response" and target == "response_json_field":
                    self._process_json_field(flow, rule, rule["action"])

    def _compute_hash(self, value: str, hash_cfg: dict) -> str:
        h_algo = hash_cfg.get("hash_algorithm", "md5")
        if h_algo == "hmac":
            algo_name = "HMAC"
            params = {
                "key": hash_cfg.get("hmac_key", ""),
                "hash_algorithm": "sha256",
                "output_encoding": "hex",
            }
        elif h_algo == "sm3":
            algo_name = "SM3"
            params = {}
        else:
            algo_name = "Hash"
            params = {"hash_algorithm": h_algo, "output_encoding": "hex"}
        return self._crypto.encrypt_with(algo_name, value, params)

    def _apply_hash_to_value(self, value: str, hash_cfg: dict) -> str:
        hash_val = self._compute_hash(value, hash_cfg)
        mode = hash_cfg.get("output_mode", "append")
        sep = hash_cfg.get("separator", "")
        if mode == "prepend":
            return hash_val + sep + value
        return value + sep + hash_val

    def _encrypt_query_params(self, flow, param_name, prefix, suffix, algo="", algo_params=None, hash_cfg=None):
        try:
            query = flow.request.query
            if not query:
                return
            modified = False
            new_query = list(query.fields)
            hash_to_param = {}
            for i, (k, v) in enumerate(new_query):
                if param_name and k != param_name:
                    continue
                if not v:
                    continue
                plain = v
                if hash_cfg and hash_cfg.get("enabled"):
                    if hash_cfg.get("output_mode") == "to_param":
                        hash_val = self._compute_hash(plain, hash_cfg)
                        target_p = hash_cfg.get("target_param", "sign")
                        hash_to_param[target_p] = hash_val
                    else:
                        plain = self._apply_hash_to_value(plain, hash_cfg)
                if algo and algo_params:
                    encrypted = self._crypto.encrypt_with(algo, plain, algo_params)
                else:
                    encrypted = self._crypto.encrypt(plain)
                if encrypted and encrypted.strip():
                    result = prefix + encrypted + suffix
                    new_query[i] = (k, result)
                    modified = True
                    print(f"[加解密网关] 参数 {k} 已加密: {flow.request.url}")
            for tp, tv in hash_to_param.items():
                found = False
                for i, (k, v) in enumerate(new_query):
                    if k == tp:
                        new_query[i] = (k, tv)
                        found = True
                        break
                if not found:
                    new_query.append((tp, tv))
                modified = True
                print(f"[加解密网关] 哈希写入参数 {tp}: {flow.request.url}")
            if modified:
                flow.request.query = new_query
        except Exception as e:
            print(f"[加解密网关] 参数加密失败: {e}")

    def _decrypt_query_params(self, flow, param_name, prefix, suffix, algo="", algo_params=None):
        try:
            query = flow.request.query
            if not query:
                return
            modified = False
            new_query = list(query.fields)
            for i, (k, v) in enumerate(new_query):
                if param_name and k != param_name:
                    continue
                if not v:
                    continue
                cipher = self._strip_wrapper(v, prefix, suffix)
                if algo and algo_params:
                    decrypted = self._crypto.decrypt_with(algo, cipher, algo_params)
                else:
                    decrypted = self._crypto.decrypt(cipher)
                if decrypted and decrypted.strip():
                    new_query[i] = (k, decrypted)
                    modified = True
                    print(f"[加解密网关] 参数 {k} 已解密: {flow.request.url}")
            if modified:
                flow.request.query = new_query
        except Exception as e:
            print(f"[加解密网关] 参数解密失败: {e}")

    def _strip_wrapper(self, text: str, prefix: str, suffix: str) -> str:
        s = text.strip()
        if prefix and s.startswith(prefix):
            s = s[len(prefix):]
        if suffix and s.endswith(suffix):
            s = s[:-len(suffix)]
        return s

    def _encrypt_body(self, flow, target, prefix, suffix, algo="", algo_params=None, hash_cfg=None):
        if target == "request":
            original = flow.request.content
        else:
            original = flow.response.content

        try:
            body = original.decode("utf-8", errors="replace")
            if hash_cfg and hash_cfg.get("enabled"):
                if hash_cfg.get("output_mode") != "to_param":
                    body = self._apply_hash_to_value(body, hash_cfg)
            if algo and algo_params:
                encrypted = self._crypto.encrypt_with(algo, body, algo_params)
            else:
                encrypted = self._crypto.encrypt(body)
            if encrypted and encrypted.strip():
                result = prefix + encrypted + suffix
                if target == "request":
                    flow.request.content = result.encode("utf-8")
                else:
                    flow.response.content = result.encode("utf-8")
                print(f"[加解密网关] {target}体已加密: {flow.request.url}")
            else:
                if target == "request":
                    flow.request.content = original
                else:
                    flow.response.content = original
                print(f"[加解密网关] 加密结果为空，保留原始数据: {flow.request.url}")
        except Exception as e:
            if target == "request":
                flow.request.content = original
            else:
                flow.response.content = original
            print(f"[加解密网关] 加密失败，保留原始数据: {e}")

    def _decrypt_body(self, flow, target, prefix, suffix, algo="", algo_params=None):
        if target == "request":
            original = flow.request.content
        else:
            original = flow.response.content

        try:
            body = original.decode("utf-8", errors="replace")
            cipher = self._strip_wrapper(body, prefix, suffix)
            if algo and algo_params:
                decrypted = self._crypto.decrypt_with(algo, cipher, algo_params)
            else:
                decrypted = self._crypto.decrypt(cipher)
            if decrypted and decrypted.strip():
                if target == "request":
                    flow.request.content = decrypted.encode("utf-8")
                else:
                    flow.response.content = decrypted.encode("utf-8")
                print(f"[加解密网关] {target}体已解密: {flow.request.url}")
            else:
                if target == "request":
                    flow.request.content = original
                else:
                    flow.response.content = original
                print(f"[加解密网关] 解密结果为空，保留原始数据: {flow.request.url}")
        except Exception as e:
            if target == "request":
                flow.request.content = original
            else:
                flow.response.content = original
            print(f"[加解密网关] 解密失败，保留原始数据: {e}")

    def _get_json_value(self, obj, path):
        for k in path.split("."):
            if isinstance(obj, dict) and k in obj:
                obj = obj[k]
            else:
                return None
        return obj

    def _set_json_value(self, obj, path, value):
        keys = path.split(".")
        for k in keys[:-1]:
            obj = obj[k]
        obj[keys[-1]] = value

    def _process_json_field(self, flow, rule, action):
        try:
            body = flow.response.content.decode("utf-8", errors="replace")
            obj = json.loads(body)

            json_path = rule.get("json_path", "")
            data_algorithm = rule.get("data_algorithm", "")
            data_params = dict(rule.get("data_params", {}))
            key_from_field = rule.get("key_from_field", "")
            key_algorithm = rule.get("key_algorithm", "")
            key_params = rule.get("key_params", {})

            if key_from_field:
                enc_key_val = self._get_json_value(obj, key_from_field)
                if enc_key_val and isinstance(enc_key_val, str):
                    decrypted_key = self._crypto.decrypt_with(
                        key_algorithm, enc_key_val, key_params)
                    data_params["key"] = decrypted_key
                    print(f"[加解密网关] 密钥字段 {key_from_field} 已解密")

            data_val = self._get_json_value(obj, json_path)
            if data_val and isinstance(data_val, str):
                if action == "decrypt":
                    result = self._crypto.decrypt_with(
                        data_algorithm, data_val, data_params)
                else:
                    result = self._crypto.encrypt_with(
                        data_algorithm, data_val, data_params)
                if result and result.strip():
                    try:
                        self._set_json_value(obj, json_path, json.loads(result))
                    except (json.JSONDecodeError, TypeError):
                        self._set_json_value(obj, json_path, result)
                    flow.response.content = json.dumps(
                        obj, ensure_ascii=False).encode("utf-8")
                    print(f"[加解密网关] JSON字段 {json_path} 已{action}: {flow.request.url}")
        except Exception as e:
            print(f"[加解密网关] JSON字段处理失败: {e}")

    def _process_chain(self, flow, rule, phase):
        try:
            from core.chain_processor import process_chain
            steps = rule.get("chain_steps", [])
            if not steps:
                return
            if phase == "request":
                body = flow.request.content.decode("utf-8", errors="replace") if flow.request.content else ""
            else:
                body = flow.response.content.decode("utf-8", errors="replace") if flow.response and flow.response.content else ""
            if not body:
                return
            result = process_chain(body, steps, self._crypto)
            if result and result != body:
                if phase == "request":
                    flow.request.content = result.encode("utf-8")
                else:
                    flow.response.content = result.encode("utf-8")
                print(f"[加解密网关] 链式处理完成({len(steps)}步): {flow.request.url}")
        except Exception as e:
            print(f"[加解密网关] 链式处理失败: {e}")


addons = [CryptoAddon()]
