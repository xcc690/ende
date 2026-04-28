"""测试加解密面板 - 手动输入明文/密文测试当前算法配置"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QTextEdit, QPushButton, QGroupBox, QFormLayout,
    QComboBox, QMessageBox
)
from PyQt5.QtCore import Qt, QThread, pyqtSignal
from core.crypto_service import CryptoService


class CryptoWorker(QThread):
    finished = pyqtSignal(str, str)  # (result, error)

    def __init__(self, service, action, data):
        super().__init__()
        self.service = service
        self.action = action
        self.data = data

    def run(self):
        try:
            if self.action == "encrypt":
                result = self.service.encrypt(self.data)
            else:
                result = self.service.decrypt(self.data)
            self.finished.emit(result, "")
        except Exception as e:
            self.finished.emit("", str(e))


class TestPanel(QWidget):
    def __init__(self, config):
        super().__init__()
        self.config = config
        self.crypto_service = CryptoService(config)
        self._worker = None
        self._init_ui()

    def _init_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(8)

        hint = QLabel("使用「配置」标签页中的算法和参数进行加解密测试")
        hint.setStyleSheet("color: #666; font-size: 9pt;")
        layout.addWidget(hint)

        input_group = QGroupBox("输入")
        input_layout = QVBoxLayout(input_group)
        self.input_text = QTextEdit()
        self.input_text.setPlaceholderText("输入明文或密文...")
        self.input_text.setMaximumHeight(150)
        input_layout.addWidget(self.input_text)
        layout.addWidget(input_group)

        btn_layout = QHBoxLayout()
        self.btn_encrypt = QPushButton("加密 →")
        self.btn_decrypt = QPushButton("解密 →")
        self.btn_clear = QPushButton("清空")
        self.btn_swap = QPushButton("↕ 交换输入输出")

        self.btn_encrypt.setMinimumHeight(36)
        self.btn_decrypt.setMinimumHeight(36)

        btn_layout.addWidget(self.btn_encrypt)
        btn_layout.addWidget(self.btn_decrypt)
        btn_layout.addStretch()
        btn_layout.addWidget(self.btn_swap)
        btn_layout.addWidget(self.btn_clear)
        layout.addLayout(btn_layout)

        output_group = QGroupBox("输出")
        output_layout = QVBoxLayout(output_group)
        self.output_text = QTextEdit()
        self.output_text.setReadOnly(True)
        self.output_text.setPlaceholderText("结果将显示在这里...")
        output_layout.addWidget(self.output_text)
        layout.addWidget(output_group)

        status_layout = QHBoxLayout()
        self.status_label = QLabel("")
        self.status_label.setStyleSheet("color: #666; font-size: 8pt;")
        status_layout.addWidget(self.status_label)
        status_layout.addStretch()
        layout.addLayout(status_layout)

        self.btn_encrypt.clicked.connect(self._do_encrypt)
        self.btn_decrypt.clicked.connect(self._do_decrypt)
        self.btn_clear.clicked.connect(self._do_clear)
        self.btn_swap.clicked.connect(self._do_swap)

    def _set_busy(self, busy: bool):
        self.btn_encrypt.setEnabled(not busy)
        self.btn_decrypt.setEnabled(not busy)
        if busy:
            self.status_label.setText("处理中...")
            self.status_label.setStyleSheet("color: #e67e22; font-size: 8pt;")
        else:
            self.status_label.setText("")

    def _do_encrypt(self):
        data = self.input_text.toPlainText().strip()
        if not data:
            return
        self._set_busy(True)
        self._worker = CryptoWorker(self.crypto_service, "encrypt", data)
        self._worker.finished.connect(self._on_result)
        self._worker.start()

    def _do_decrypt(self):
        data = self.input_text.toPlainText().strip()
        if not data:
            return
        self._set_busy(True)
        self._worker = CryptoWorker(self.crypto_service, "decrypt", data)
        self._worker.finished.connect(self._on_result)
        self._worker.start()

    def _on_result(self, result: str, error: str):
        self._set_busy(False)
        if error:
            self.output_text.setPlainText("")
            self.status_label.setText(f"错误: {error}")
            self.status_label.setStyleSheet("color: red; font-size: 8pt;")
        else:
            self.output_text.setPlainText(result)
            algo = self.config.get("crypto.algorithm")
            engine = self.config.get("crypto.engine")
            self.status_label.setText(f"完成 [{engine}] {algo}")
            self.status_label.setStyleSheet("color: green; font-size: 8pt;")

    def _do_clear(self):
        self.input_text.clear()
        self.output_text.clear()
        self.status_label.setText("")

    def _do_swap(self):
        output = self.output_text.toPlainText()
        self.input_text.setPlainText(output)
        self.output_text.clear()
        self.status_label.setText("")
