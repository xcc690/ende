"""JSRPC 配置面板"""

from PyQt5.QtWidgets import (
    QGroupBox, QFormLayout, QCheckBox, QLineEdit, QTextEdit
)


class JSRPCPanel(QGroupBox):
    def __init__(self, config):
        super().__init__("JSRPC 配置（可选）")
        self.config = config
        self._init_ui()
        self._load_config()

    def _init_ui(self):
        layout = QFormLayout(self)

        self.enable_check = QCheckBox("启用 JSRPC")
        layout.addRow(self.enable_check)

        self.url_input = QLineEdit()
        self.url_input.setPlaceholderText("http://127.0.0.1:3000/rpc")
        layout.addRow("RPC 地址:", self.url_input)

        self.timeout_input = QLineEdit()
        self.timeout_input.setPlaceholderText("5")
        layout.addRow("超时时间(秒):", self.timeout_input)

        self.headers_input = QTextEdit()
        self.headers_input.setMaximumHeight(60)
        self.headers_input.setPlaceholderText('{"Content-Type": "application/json"}')
        layout.addRow("Headers (JSON):", self.headers_input)

        self._set_fields_enabled(False)

        self.enable_check.toggled.connect(self._on_toggle)
        self.url_input.textChanged.connect(self._save_config)
        self.timeout_input.textChanged.connect(self._save_config)
        self.headers_input.textChanged.connect(self._save_config)

    def _load_config(self):
        jsrpc = self.config.get_jsrpc_config()
        self.enable_check.setChecked(jsrpc.get("enable", False))
        self.url_input.setText(jsrpc.get("url", ""))
        self.timeout_input.setText(str(jsrpc.get("timeout", 5)))
        self.headers_input.setPlainText(jsrpc.get("headers", "{}"))
        self._set_fields_enabled(jsrpc.get("enable", False))

    def _on_toggle(self, checked: bool):
        self._set_fields_enabled(checked)
        self._save_config()

    def _set_fields_enabled(self, enabled: bool):
        self.url_input.setEnabled(enabled)
        self.timeout_input.setEnabled(enabled)
        self.headers_input.setEnabled(enabled)

    def _save_config(self):
        self.config.set("jsrpc.enable", self.enable_check.isChecked())
        self.config.set("jsrpc.url", self.url_input.text())
        try:
            timeout = int(self.timeout_input.text())
        except ValueError:
            timeout = 5
        self.config.set("jsrpc.timeout", timeout)
        self.config.set("jsrpc.headers", self.headers_input.toPlainText())
