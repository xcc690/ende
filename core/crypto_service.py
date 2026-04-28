"""加解密服务层 - 通过 Node.js subprocess 调用 JS 引擎"""

import json
import os
import subprocess
import shutil
import urllib.parse
import requests


class JSEngine:
    def __init__(self):
        from core.path_utils import get_project_root
        self._node_path = shutil.which("node") or "node"
        self._cli_path = os.path.join(get_project_root(), "js_engine", "cli.js")

    def call(self, action: str, algorithm: str, data: str, params: dict) -> str:
        payload = json.dumps({
            "action": action,
            "algorithm": algorithm,
            "data": str(data),
            "params": params
        }, ensure_ascii=False)

        result = subprocess.run(
            [self._node_path, self._cli_path],
            input=payload.encode("utf-8"),
            capture_output=True, timeout=10,
            cwd=os.path.dirname(self._cli_path)
        )

        if result.returncode != 0:
            raise RuntimeError(f"JS 引擎错误: {result.stderr.decode('utf-8', errors='replace')}")

        stdout = result.stdout.decode("utf-8")
        resp = json.loads(stdout)
        if not resp.get("ok"):
            raise RuntimeError(f"加解密失败: {resp.get('error', '未知错误')}")
        return resp["result"]


class JSRPCEngine:
    def __init__(self, url: str, timeout: int = 5):
        self.url = url.rstrip("/")
        self.timeout = timeout

    def _is_nested_json(self, obj) -> bool:
        if not isinstance(obj, dict):
            return False
        for v in obj.values():
            if isinstance(v, (dict, list)):
                return True
            if isinstance(v, str):
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, (dict, list)):
                        return True
                except (json.JSONDecodeError, TypeError):
                    pass
        return False

    def call(self, group: str, action: str, data: str) -> str:
        try:
            obj = json.loads(data)
            compact = json.dumps(obj, separators=(',', ':'))
            if self._is_nested_json(obj):
                param_str = "'" + compact + "'"
            else:
                param_str = compact
        except (json.JSONDecodeError, TypeError):
            param_str = data

        encoded = urllib.parse.quote(param_str, safe='')
        url = f"{self.url}?group={urllib.parse.quote(group, safe='')}&action={urllib.parse.quote(action, safe='')}&param={encoded}"

        resp = requests.get(url, timeout=self.timeout)
        resp.raise_for_status()
        result = resp.json()
        ret = result.get("data")
        if ret is None:
            raise RuntimeError(f"JSRPC 返回无 data 字段: {result}")
        if not isinstance(ret, str):
            ret = json.dumps(ret, separators=(',', ':'))
        if ret.startswith("'") and ret.endswith("'"):
            ret = ret[1:-1]
        return ret


class CryptoService:
    def __init__(self, config_center):
        self.config = config_center
        self._js_engine = JSEngine()

    def _get_jsrpc(self) -> JSRPCEngine:
        jsrpc_cfg = self.config.get_jsrpc_config()
        return JSRPCEngine(
            url=jsrpc_cfg["url"],
            timeout=jsrpc_cfg.get("timeout", 5)
        )

    def encrypt(self, plaintext: str) -> str:
        crypto_cfg = self.config.get_crypto_config()
        engine = crypto_cfg["engine"]
        algorithm = crypto_cfg["algorithm"]
        params = crypto_cfg["params"]

        if engine == "jsrpc" and self.config.get("jsrpc.enable"):
            rpc = self._get_jsrpc()
            group = self.config.get("jsrpc.group") or ""
            action = self.config.get("jsrpc.encrypt_func") or "encrypt"
            return rpc.call(group, action, plaintext)

        return self._js_engine.call("encrypt", algorithm, plaintext, params)

    def decrypt(self, ciphertext: str) -> str:
        crypto_cfg = self.config.get_crypto_config()
        engine = crypto_cfg["engine"]
        algorithm = crypto_cfg["algorithm"]
        params = crypto_cfg["params"]

        if engine == "jsrpc" and self.config.get("jsrpc.enable"):
            rpc = self._get_jsrpc()
            group = self.config.get("jsrpc.group") or ""
            action = self.config.get("jsrpc.decrypt_func") or "decrypt"
            return rpc.call(group, action, ciphertext)

        return self._js_engine.call("decrypt", algorithm, ciphertext, params)

    def generate_keypair(self, algorithm: str, params: dict = None) -> dict:
        result = self._js_engine.call("generate_keypair", algorithm, "", params or {})
        return json.loads(result)


class GatewayCryptoService:
    """直接从网关配置 dict 读取，供 addon 使用"""

    def __init__(self, gw_config: dict):
        self._cfg = gw_config
        self._js_engine = JSEngine()

    def _get_jsrpc(self) -> JSRPCEngine:
        jsrpc_cfg = self._cfg.get("jsrpc", {})
        return JSRPCEngine(
            url=jsrpc_cfg.get("url", "http://127.0.0.1:12080/go"),
            timeout=jsrpc_cfg.get("timeout", 5)
        )

    def encrypt(self, plaintext: str) -> str:
        crypto = self._cfg.get("crypto", {})
        engine = crypto.get("engine", "local")
        algorithm = crypto.get("algorithm", "AES")
        params = crypto.get("params", {})
        jsrpc_cfg = self._cfg.get("jsrpc", {})

        if engine == "jsrpc" and jsrpc_cfg.get("enable"):
            rpc = self._get_jsrpc()
            group = jsrpc_cfg.get("group", "")
            action = jsrpc_cfg.get("encrypt_func", "encrypt")
            return rpc.call(group, action, plaintext)

        return self._js_engine.call("encrypt", algorithm, plaintext, params)

    def decrypt(self, ciphertext: str) -> str:
        crypto = self._cfg.get("crypto", {})
        engine = crypto.get("engine", "local")
        algorithm = crypto.get("algorithm", "AES")
        params = crypto.get("params", {})
        jsrpc_cfg = self._cfg.get("jsrpc", {})

        if engine == "jsrpc" and jsrpc_cfg.get("enable"):
            rpc = self._get_jsrpc()
            group = jsrpc_cfg.get("group", "")
            action = jsrpc_cfg.get("decrypt_func", "decrypt")
            return rpc.call(group, action, ciphertext)

        return self._js_engine.call("decrypt", algorithm, ciphertext, params)
