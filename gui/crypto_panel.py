"""算法配置面板 - 引擎模式切换 + 动态参数区 + 条件可见性"""

import os
from PyQt5.QtWidgets import (
    QGroupBox, QVBoxLayout, QHBoxLayout, QFormLayout,
    QComboBox, QLineEdit, QTextEdit, QWidget, QLabel,
    QStackedWidget, QPushButton
)
from PyQt5.QtCore import Qt, QProcess, pyqtSignal


ALGORITHM_PARAMS = {
    "AES": [
        ("key", "Key", "line", ""),
        ("iv", "IV", "line", ""),
        ("key_encoding", "Key编码", "combo", ["utf-8", "hex", "base64"]),
        ("mode", "Mode", "combo", ["CBC", "ECB", "CFB", "OFB", "CTR"]),
        ("padding", "Padding", "combo",
         ["PKCS7", "ZeroPadding", "NoPadding", "Iso10126", "AnsiX923"]),
        ("output_encoding", "输出编码", "combo", ["base64", "hex"]),
    ],
    "DES": [
        ("key", "Key (8字节)", "line", ""),
        ("iv", "IV (8字节)", "line", ""),
        ("key_encoding", "Key编码", "combo", ["utf-8", "hex", "base64"]),
        ("mode", "Mode", "combo", ["CBC", "ECB", "CFB", "OFB"]),
        ("padding", "Padding", "combo", ["PKCS7", "ZeroPadding", "NoPadding"]),
        ("output_encoding", "输出编码", "combo", ["base64", "hex"]),
    ],
    "3DES": [
        ("key", "Key (24字节)", "line", ""),
        ("iv", "IV (8字节)", "line", ""),
        ("key_encoding", "Key编码", "combo", ["utf-8", "hex", "base64"]),
        ("mode", "Mode", "combo", ["CBC", "ECB", "CFB", "OFB"]),
        ("padding", "Padding", "combo", ["PKCS7", "ZeroPadding", "NoPadding"]),
        ("output_encoding", "输出编码", "combo", ["base64", "hex"]),
    ],
    "RC4": [
        ("key", "Key", "line", ""),
        ("key_encoding", "Key编码", "combo", ["utf-8", "hex", "base64"]),
        ("output_encoding", "输出编码", "combo", ["base64", "hex"]),
    ],
    "RSA": [
        ("key_encoding", "密钥编码", "combo", ["pem", "base64", "hex"]),
        ("encrypt_with", "加密方式", "combo", ["public", "private"]),
        ("public_key", "Public Key", "text", ""),
        ("private_key", "Private Key", "text", ""),
        ("padding", "Padding", "combo", ["OAEP", "PKCS1_v1_5"]),
        ("output_encoding", "输出编码", "combo", ["base64", "hex"]),
    ],
    "SM2": [
        ("key_encoding", "密钥编码", "combo", ["hex", "base64"]),
        ("public_key", "Public Key", "text", ""),
        ("private_key", "Private Key", "text", ""),
        ("cipher_mode", "密文格式", "combo", ["1", "0"]),
    ],
    "SM3": [],
    "SM4": [
        ("key", "Key (Hex 32字符)", "line", ""),
        ("iv", "IV (Hex 32字符)", "line", ""),
        ("mode", "Mode", "combo", ["ecb", "cbc"]),
        ("output_encoding", "输出编码", "combo", ["hex", "base64"]),
    ],
    "Hash": [
        ("hash_algorithm", "算法", "combo",
         ["md5", "sha1", "sha256", "sha512", "sha224", "sha384", "sha3", "ripemd160"]),
        ("output_encoding", "编码格式", "combo", ["hex", "base64"]),
    ],
    "HMAC": [
        ("key", "密钥", "line", ""),
        ("hash_algorithm", "算法", "combo",
         ["sha256", "sha1", "sha512", "sha384", "sha224", "md5"]),
        ("output_encoding", "编码格式", "combo", ["hex", "base64"]),
    ],
    "Base64": [],
}

# 条件可见性规则: { (算法, 字段key): (依赖字段key, 可见值集合) }
VISIBILITY_RULES = {
    ("AES", "iv"):      ("mode", {"CBC", "CFB", "OFB"}),
    ("AES", "padding"):  ("mode", {"CBC", "ECB"}),
    ("DES", "iv"):      ("mode", {"CBC", "CFB", "OFB"}),
    ("DES", "padding"):  ("mode", {"CBC", "ECB"}),
    ("3DES", "iv"):     ("mode", {"CBC", "CFB", "OFB"}),
    ("3DES", "padding"): ("mode", {"CBC", "ECB"}),
    ("SM4", "iv"):      ("mode", {"cbc"}),
    ("RSA", "public_key"):  ("encrypt_with", {"public"}),
    ("RSA", "private_key"): ("encrypt_with", {"private"}),
}


class CryptoPanel(QGroupBox):
    jsrpc_log = pyqtSignal(str)

    def __init__(self, config):
        super().__init__("算法配置")
        self.config = config
        self._param_widgets = {}
        self._param_labels = {}
        self._current_algo = "AES"
        self._jsrpc_process = None
        self._init_ui()
        self._load_config()

    def _init_ui(self):
        main_layout = QVBoxLayout(self)

        top_layout = QHBoxLayout()
        self.engine_combo = QComboBox()
        self.engine_combo.addItems(["local", "jsrpc"])
        top_layout.addWidget(QLabel("引擎模式:"))
        top_layout.addWidget(self.engine_combo)

        self.algo_combo = QComboBox()
        self.algo_combo.addItems(list(ALGORITHM_PARAMS.keys()))
        top_layout.addWidget(QLabel("算法:"))
        top_layout.addWidget(self.algo_combo)
        top_layout.addStretch()
        main_layout.addLayout(top_layout)

        self.engine_stack = QStackedWidget()

        self.local_params = QWidget()
        self.local_params_layout = QFormLayout(self.local_params)
        self.local_params_layout.setContentsMargins(0, 0, 0, 0)
        self.engine_stack.addWidget(self.local_params)

        self.jsrpc_widget = self._build_jsrpc_widget()
        self.engine_stack.addWidget(self.jsrpc_widget)

        main_layout.addWidget(self.engine_stack)

        self.engine_combo.currentTextChanged.connect(self._on_engine_changed)
        self.algo_combo.currentTextChanged.connect(self._on_algorithm_changed)

        self._build_params("AES")

    def _build_jsrpc_widget(self) -> QWidget:
        w = QWidget()
        layout = QFormLayout(w)
        layout.setContentsMargins(0, 0, 0, 0)

        self.jsrpc_url = QLineEdit()
        self.jsrpc_url.setPlaceholderText("http://127.0.0.1:12080/go")
        layout.addRow("RPC 地址:", self.jsrpc_url)

        self.jsrpc_group = QLineEdit()
        self.jsrpc_group.setPlaceholderText("如 zzz")
        layout.addRow("Group:", self.jsrpc_group)

        self.jsrpc_encrypt_func = QLineEdit()
        self.jsrpc_encrypt_func.setPlaceholderText("如 _reqUtils.encs")
        layout.addRow("加密 Action:", self.jsrpc_encrypt_func)

        self.jsrpc_decrypt_func = QLineEdit()
        self.jsrpc_decrypt_func.setPlaceholderText("如 _reqUtils.decs")
        layout.addRow("解密 Action:", self.jsrpc_decrypt_func)

        self.jsrpc_timeout = QLineEdit("5")
        layout.addRow("超时(秒):", self.jsrpc_timeout)

        btn_layout = QHBoxLayout()
        self.btn_jsrpc_toggle = QPushButton("启动 JSRPC 服务")
        self.btn_jsrpc_toggle.clicked.connect(self._toggle_jsrpc)
        self.jsrpc_status_label = QLabel("")
        self.jsrpc_status_label.setStyleSheet("color: #666; font-size: 9pt;")
        btn_layout.addWidget(self.btn_jsrpc_toggle)
        btn_layout.addWidget(self.jsrpc_status_label)
        btn_layout.addStretch()
        layout.addRow(btn_layout)

        for widget in (self.jsrpc_url, self.jsrpc_group, self.jsrpc_encrypt_func,
                       self.jsrpc_decrypt_func, self.jsrpc_timeout):
            widget.textChanged.connect(self._save_jsrpc)

        return w

    def _toggle_jsrpc(self):
        if self._jsrpc_process and self._jsrpc_process.state() == QProcess.Running:
            self._jsrpc_process.kill()
            self._jsrpc_process.waitForFinished(2000)
            self._jsrpc_process = None
            self.btn_jsrpc_toggle.setText("启动 JSRPC 服务")
            self.jsrpc_status_label.setText("已停止")
            self.jsrpc_status_label.setStyleSheet("color: #666; font-size: 9pt;")
            self.jsrpc_log.emit("[JSRPC] 服务已停止")
            return

        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        exe_path = os.path.join(project_root, "jsrpc.exe")
        if not os.path.exists(exe_path):
            self.jsrpc_status_label.setText("jsrpc.exe 不存在")
            self.jsrpc_status_label.setStyleSheet("color: red; font-size: 9pt;")
            self.jsrpc_log.emit(f"[JSRPC] 文件不存在: {exe_path}")
            return

        self._jsrpc_process = QProcess(self)
        self._jsrpc_process.setWorkingDirectory(project_root)
        self._jsrpc_process.setProgram(exe_path)
        self._jsrpc_process.setProcessChannelMode(QProcess.MergedChannels)
        self._jsrpc_process.readyReadStandardOutput.connect(self._read_jsrpc_output)
        self._jsrpc_process.finished.connect(self._on_jsrpc_finished)
        self._jsrpc_process.errorOccurred.connect(self._on_jsrpc_error)
        self._jsrpc_process.start()

        self.jsrpc_log.emit(f"[JSRPC] 正在启动: {exe_path}")
        if self._jsrpc_process.waitForStarted(3000):
            self.btn_jsrpc_toggle.setText("停止 JSRPC 服务")
            self.jsrpc_status_label.setText("运行中")
            self.jsrpc_status_label.setStyleSheet("color: green; font-size: 9pt;")
            self.jsrpc_log.emit("[JSRPC] 服务已启动")
        else:
            err = self._jsrpc_process.errorString()
            self.jsrpc_status_label.setText("启动失败")
            self.jsrpc_status_label.setStyleSheet("color: red; font-size: 9pt;")
            self.jsrpc_log.emit(f"[JSRPC] 启动失败: {err}")
            self._jsrpc_process = None

    def _read_jsrpc_output(self):
        if not self._jsrpc_process:
            return
        data = self._jsrpc_process.readAllStandardOutput()
        text = bytes(data).decode("utf-8", errors="replace").strip()
        if text:
            for line in text.splitlines():
                self.jsrpc_log.emit(f"[JSRPC] {line}")

    def _on_jsrpc_error(self, error):
        error_map = {
            QProcess.FailedToStart: "无法启动进程",
            QProcess.Crashed: "进程崩溃",
            QProcess.Timedout: "超时",
            QProcess.WriteError: "写入错误",
            QProcess.ReadError: "读取错误",
        }
        msg = error_map.get(error, f"未知错误({error})")
        self.jsrpc_log.emit(f"[JSRPC] 错误: {msg}")

    def _on_jsrpc_finished(self, exit_code, exit_status):
        self.jsrpc_log.emit(f"[JSRPC] 进程退出 (code={exit_code})")
        self._jsrpc_process = None
        self.btn_jsrpc_toggle.setText("启动 JSRPC 服务")
        self.jsrpc_status_label.setText("已停止")
        self.jsrpc_status_label.setStyleSheet("color: #666; font-size: 9pt;")

    def _load_config(self):
        crypto = self.config.get_crypto_config()
        self.engine_combo.setCurrentText(crypto["engine"])
        self.algo_combo.setCurrentText(crypto["algorithm"])
        self._on_engine_changed(crypto["engine"])
        self._build_params(crypto["algorithm"])

        for key, value in crypto.get("params", {}).items():
            widget = self._param_widgets.get(key)
            if widget is None:
                continue
            if isinstance(widget, QComboBox):
                widget.setCurrentText(str(value))
            elif isinstance(widget, QTextEdit):
                widget.setPlainText(str(value))
            elif isinstance(widget, QLineEdit):
                widget.setText(str(value))

        self._apply_visibility()

        jsrpc = self.config.get_jsrpc_config()
        self.jsrpc_url.setText(jsrpc.get("url", ""))
        self.jsrpc_group.setText(jsrpc.get("group", ""))
        self.jsrpc_encrypt_func.setText(jsrpc.get("encrypt_func", "encrypt"))
        self.jsrpc_decrypt_func.setText(jsrpc.get("decrypt_func", "decrypt"))
        self.jsrpc_timeout.setText(str(jsrpc.get("timeout", 5)))

    def _build_params(self, algorithm: str):
        self._current_algo = algorithm

        while self.local_params_layout.count():
            item = self.local_params_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()

        self._param_widgets.clear()
        self._param_labels.clear()
        fields = ALGORITHM_PARAMS.get(algorithm, [])

        for field_key, label, field_type, options in fields:
            if field_type == "line":
                widget = QLineEdit()
                widget.textChanged.connect(self._save_params)
            elif field_type == "combo":
                widget = QComboBox()
                widget.addItems(options)
                widget.currentTextChanged.connect(self._save_params)
                rule_key = (algorithm, field_key)
                if any(r[0] == field_key
                       for k, r in VISIBILITY_RULES.items()
                       if k[0] == algorithm):
                    widget.currentTextChanged.connect(self._apply_visibility)
            elif field_type == "text":
                widget = QTextEdit()
                widget.setMaximumHeight(80)
                widget.textChanged.connect(self._save_params)
            else:
                continue

            lbl = QLabel(f"{label}:")
            self._param_widgets[field_key] = widget
            self._param_labels[field_key] = lbl
            self.local_params_layout.addRow(lbl, widget)

        self._apply_visibility()

    def _apply_visibility(self):
        algo = self._current_algo
        for (rule_algo, field_key), (dep_key, visible_values) in VISIBILITY_RULES.items():
            if rule_algo != algo:
                continue
            widget = self._param_widgets.get(field_key)
            label = self._param_labels.get(field_key)
            dep_widget = self._param_widgets.get(dep_key)
            if not widget or not dep_widget:
                continue

            if isinstance(dep_widget, QComboBox):
                current = dep_widget.currentText()
            elif isinstance(dep_widget, QLineEdit):
                current = dep_widget.text()
            else:
                continue

            visible = current in visible_values
            widget.setVisible(visible)
            if label:
                label.setVisible(visible)

    def _on_engine_changed(self, engine: str):
        self.config.set("crypto.engine", engine)
        if engine == "jsrpc":
            self.engine_stack.setCurrentIndex(1)
            self.config.set("jsrpc.enable", True)
        else:
            self.engine_stack.setCurrentIndex(0)
            self.config.set("jsrpc.enable", False)

    def _on_algorithm_changed(self, algorithm: str):
        self.config.set("crypto.algorithm", algorithm)
        self._build_params(algorithm)
        self._save_params()

    def _save_params(self):
        params = {}
        for key, widget in self._param_widgets.items():
            if isinstance(widget, QComboBox):
                params[key] = widget.currentText()
            elif isinstance(widget, QTextEdit):
                params[key] = widget.toPlainText()
            elif isinstance(widget, QLineEdit):
                params[key] = widget.text()
        self.config.set("crypto.params", params)

    def _save_jsrpc(self):
        self.config.set("jsrpc.url", self.jsrpc_url.text())
        self.config.set("jsrpc.group", self.jsrpc_group.text())
        self.config.set("jsrpc.encrypt_func",
                        self.jsrpc_encrypt_func.text() or "encrypt")
        self.config.set("jsrpc.decrypt_func",
                        self.jsrpc_decrypt_func.text() or "decrypt")
        try:
            timeout = int(self.jsrpc_timeout.text())
        except ValueError:
            timeout = 5
        self.config.set("jsrpc.timeout", timeout)
