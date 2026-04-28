"""网络配置面板 - 双网关独立配置"""

from PyQt5.QtWidgets import (
    QGroupBox, QHBoxLayout, QVBoxLayout, QFormLayout,
    QLineEdit, QLabel
)
from PyQt5.QtCore import Qt


class NetworkPanel(QGroupBox):
    def __init__(self, config):
        super().__init__("网络配置")
        self.config = config
        self._init_ui()
        self._load_config()

    def _init_ui(self):
        layout = QHBoxLayout(self)

        dec_group = QGroupBox("解密网关")
        dec_form = QFormLayout(dec_group)
        self.dec_port = QLineEdit()
        self.dec_port.setPlaceholderText("8080")
        self.dec_upstream = QLineEdit()
        self.dec_upstream.setPlaceholderText("http://127.0.0.1:8082")
        dec_form.addRow("监听端口:", self.dec_port)
        dec_form.addRow("上游代理:", self.dec_upstream)
        layout.addWidget(dec_group)

        enc_group = QGroupBox("加密网关")
        enc_form = QFormLayout(enc_group)
        self.enc_port = QLineEdit()
        self.enc_port.setPlaceholderText("8082")
        self.enc_upstream = QLineEdit()
        self.enc_upstream.setPlaceholderText("http://127.0.0.1:8888")
        enc_form.addRow("监听端口:", self.enc_port)
        enc_form.addRow("上游代理:", self.enc_upstream)
        layout.addWidget(enc_group)

        self.dec_port.textChanged.connect(self._save_config)
        self.dec_upstream.textChanged.connect(self._save_config)
        self.enc_port.textChanged.connect(self._save_config)
        self.enc_upstream.textChanged.connect(self._save_config)

    def _load_config(self):
        dec = self.config.get("network.decrypt_gateway")
        enc = self.config.get("network.encrypt_gateway")
        self.dec_port.setText(str(dec["listen_port"]))
        self.dec_upstream.setText(dec.get("upstream_proxy", ""))
        self.enc_port.setText(str(enc["listen_port"]))
        self.enc_upstream.setText(enc.get("upstream_proxy", ""))

    def _save_config(self):
        try:
            dec_port = int(self.dec_port.text())
        except ValueError:
            dec_port = 0
        try:
            enc_port = int(self.enc_port.text())
        except ValueError:
            enc_port = 0

        self.config.set("network.decrypt_gateway.listen_port", dec_port)
        self.config.set("network.decrypt_gateway.upstream_proxy", self.dec_upstream.text())
        self.config.set("network.encrypt_gateway.listen_port", enc_port)
        self.config.set("network.encrypt_gateway.upstream_proxy", self.enc_upstream.text())
