"""mitmproxy addon - 解密网关（从配置文件加载）"""
import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mitmproxy import http


class DecryptAddon:
    def __init__(self):
        self._crypto = None
        self._gw_config = None

    def _init_services(self):
        if self._crypto is None:
            from core.crypto_service import CryptoService, GatewayCryptoService
            config_file = os.environ.get("ENDE_CONFIG_FILE", "")
            if config_file and os.path.exists(config_file):
                with open(config_file, "r", encoding="utf-8") as f:
                    self._gw_config = json.load(f)
            else:
                self._gw_config = {}
            self._crypto = GatewayCryptoService(self._gw_config)

    def request(self, flow: http.HTTPFlow):
        if not flow.request.content:
            return
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

        flow_data = {
            "request_headers": dict(flow.request.headers),
            "request_body": req_body,
            "response_body": resp_body,
        }

        matched = find_matching_rules(rules, flow_data)
        decrypt_rules = [r for r in matched if r["action"] == "decrypt"]
        if not decrypt_rules:
            return

        rule = decrypt_rules[0]
        target = rule["target"]
        prefix = rule.get("wrapper_prefix", "")
        suffix = rule.get("wrapper_suffix", "")

        if phase == "request" and target in ("request_body", "request_header"):
            self._decrypt_body(flow, "request", prefix, suffix)
        elif phase == "response" and target == "response_body":
            self._decrypt_body(flow, "response", prefix, suffix)

    def _strip_wrapper(self, text: str, prefix: str, suffix: str) -> str:
        s = text.strip()
        if prefix and s.startswith(prefix):
            s = s[len(prefix):]
        if suffix and s.endswith(suffix):
            s = s[:-len(suffix)]
        return s

    def _decrypt_body(self, flow, target, prefix, suffix):
        if target == "request":
            original = flow.request.content
        else:
            original = flow.response.content

        try:
            body = original.decode("utf-8", errors="replace")
            cipher = self._strip_wrapper(body, prefix, suffix)
            decrypted = self._crypto.decrypt(cipher)
            if decrypted and decrypted.strip():
                if target == "request":
                    flow.request.content = decrypted.encode("utf-8")
                else:
                    flow.response.content = decrypted.encode("utf-8")
                print(f"[解密网关] {target}体已解密: {flow.request.url}")
            else:
                if target == "request":
                    flow.request.content = original
                else:
                    flow.response.content = original
                print(f"[解密网关] 解密结果为空，保留原始数据: {flow.request.url}")
        except Exception as e:
            if target == "request":
                flow.request.content = original
            else:
                flow.response.content = original
            print(f"[解密网关] 解密失败，保留原始数据: {e}")


addons = [DecryptAddon()]
