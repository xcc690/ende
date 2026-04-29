"""网络配置弹出窗口"""

from PyQt5.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QFormLayout,
    QComboBox, QLineEdit, QPushButton
)


class NetworkDialog(QDialog):
    def __init__(self, gw_config: dict, parent=None):
        super().__init__(parent)
        self.setWindowTitle("网络配置")
        self.setMinimumWidth(400)
        self._result = dict(gw_config)
        self._init_ui(gw_config)

    def _init_ui(self, gw_config: dict):
        layout = QVBoxLayout(self)
        layout.setSpacing(10)

        form = QFormLayout()

        self.cb_type = QComboBox()
        self.cb_type.addItem("解密", "decrypt")
        self.cb_type.addItem("加密", "encrypt")
        self.cb_type.addItem("加解密", "both")
        idx = self.cb_type.findData(gw_config.get("type", "decrypt"))
        if idx >= 0:
            self.cb_type.setCurrentIndex(idx)
        form.addRow("网关类型:", self.cb_type)

        self.input_port = QLineEdit()
        self.input_port.setPlaceholderText("8080")
        self.input_port.setText(str(gw_config.get("network", {}).get("listen_port", "")))
        form.addRow("监听端口:", self.input_port)

        self.input_upstream = QLineEdit()
        self.input_upstream.setPlaceholderText("http://127.0.0.1:8082")
        self.input_upstream.setText(gw_config.get("network", {}).get("upstream_proxy", ""))
        form.addRow("上游代理:", self.input_upstream)

        layout.addLayout(form)

        bottom = QHBoxLayout()
        bottom.addStretch()
        btn_ok = QPushButton("  确定  ")
        btn_ok.setStyleSheet(
            "QPushButton { background-color: #a6e3a1; color: #1e1e2e; font-weight: bold; }"
            "QPushButton:hover { background-color: #94e2d5; }")
        btn_cancel = QPushButton("  取消  ")
        btn_ok.clicked.connect(self._on_ok)
        btn_cancel.clicked.connect(self.reject)
        bottom.addWidget(btn_ok)
        bottom.addWidget(btn_cancel)
        layout.addLayout(bottom)

    def _on_ok(self):
        try:
            port = int(self.input_port.text())
        except ValueError:
            port = 0
        self._result["type"] = self.cb_type.currentData()
        self._result.setdefault("network", {})
        self._result["network"]["listen_port"] = port
        self._result["network"]["upstream_proxy"] = self.input_upstream.text()
        self.accept()

    def get_config(self) -> dict:
        return self._result
