"""内存配置中心 - 支持多网关独立配置"""

import copy
import json
from PyQt5.QtCore import QObject, pyqtSignal


GATEWAY_TEMPLATE = {
    "name": "",
    "type": "decrypt",
    "network": {
        "listen_port": 8080,
        "upstream_proxy": ""
    },
    "crypto": {
        "engine": "local",
        "algorithm": "AES",
        "params": {
            "key": "",
            "iv": "",
            "mode": "CBC",
            "padding": "PKCS7",
            "input_encoding": "utf-8",
            "output_encoding": "base64"
        }
    },
    "jsrpc": {
        "enable": False,
        "url": "http://127.0.0.1:12080/go",
        "group": "",
        "encrypt_func": "encrypt",
        "decrypt_func": "decrypt",
        "timeout": 5
    },
    "match_rules": []
}


class ConfigCenter(QObject):
    config_changed = pyqtSignal(str)

    _instance = None

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        super().__init__()
        self._gateways = []

    def add_gateway(self, name: str, gw_type: str = "decrypt", port: int = 0) -> dict:
        gw = copy.deepcopy(GATEWAY_TEMPLATE)
        gw["name"] = name
        gw["type"] = gw_type
        if port:
            gw["network"]["listen_port"] = port
        self._gateways.append(gw)
        self.config_changed.emit("gateways")
        return gw

    def remove_gateway(self, name: str):
        self._gateways = [g for g in self._gateways if g["name"] != name]
        self.config_changed.emit("gateways")

    def get_gateway(self, name: str) -> dict:
        for g in self._gateways:
            if g["name"] == name:
                return g
        raise KeyError(f"网关不存在: {name}")

    def get_all_gateways(self) -> list:
        return self._gateways

    def set_gateway_value(self, gw_name: str, path: str, value):
        gw = self.get_gateway(gw_name)
        keys = path.split(".")
        target = gw
        for k in keys[:-1]:
            target = target[k]
        target[keys[-1]] = value
        self.config_changed.emit(f"{gw_name}.{path}")

    def get_gateway_value(self, gw_name: str, path: str):
        gw = self.get_gateway(gw_name)
        keys = path.split(".")
        val = gw
        for k in keys:
            val = val[k]
        return val

    def export_gateway_config(self, gw_name: str, filepath: str):
        gw = self.get_gateway(gw_name)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(gw, f, ensure_ascii=False, indent=2)

    def save_to_file(self, path: str):
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"gateways": self._gateways}, f, ensure_ascii=False, indent=2)

    def load_from_file(self, path: str):
        with open(path, "r", encoding="utf-8") as f:
            loaded = json.load(f)
        if "gateways" in loaded:
            self._gateways = loaded["gateways"]
        elif "type" in loaded:
            self._gateways = [loaded]

    def import_gateway(self, data: dict) -> dict:
        """从单网关 dict 导入，自动补全缺失字段"""
        import copy as _copy
        gw = _copy.deepcopy(GATEWAY_TEMPLATE)
        self._deep_merge(gw, data)
        name = gw.get("name", "")
        if not name:
            name = f"gateway_{len(self._gateways) + 1}"
            gw["name"] = name
        existing_names = {g["name"] for g in self._gateways}
        if name in existing_names:
            i = 2
            while f"{name}_{i}" in existing_names:
                i += 1
            gw["name"] = f"{name}_{i}"
        self._gateways.append(gw)
        self.config_changed.emit("gateways")
        return gw

    def _deep_merge(self, base: dict, override: dict):
        for k, v in override.items():
            if k in base and isinstance(base[k], dict) and isinstance(v, dict):
                self._deep_merge(base[k], v)
            else:
                base[k] = v

    @staticmethod
    def load_gateway_from_file(path: str) -> dict:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
