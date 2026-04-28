"""单个网关的完整配置标签页"""

import os
from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QFormLayout, QGroupBox,
    QComboBox, QLineEdit, QTextEdit, QLabel, QPushButton,
    QTableWidget, QTableWidgetItem, QHeaderView, QAbstractItemView,
    QStackedWidget, QScrollArea, QSplitter
)
from PyQt5.QtCore import Qt, QProcess, pyqtSignal


ALGORITHMS = ["AES", "DES", "3DES", "RC4", "RSA", "SM2", "SM3", "SM4", "Hash", "HMAC", "Base64"]

ALGO_PARAMS = {
    "AES": [
        ("key", "密钥", "line", ""),
        ("iv", "IV", "line", ""),
        ("mode", "模式", "combo", ["CBC", "ECB", "CFB", "OFB", "CTR"]),
        ("padding", "填充", "combo", ["PKCS7", "ZeroPadding", "NoPadding"]),
        ("output_encoding", "输出编码", "combo", ["base64", "hex"]),
        ("key_encoding", "密钥编码", "combo", ["utf-8", "hex", "base64"]),
    ],
    "DES": [
        ("key", "密钥", "line", ""),
        ("iv", "IV", "line", ""),
        ("mode", "模式", "combo", ["CBC", "ECB"]),
        ("padding", "填充", "combo", ["PKCS7", "ZeroPadding", "NoPadding"]),
        ("output_encoding", "输出编码", "combo", ["base64", "hex"]),
        ("key_encoding", "密钥编码", "combo", ["utf-8", "hex", "base64"]),
    ],
    "3DES": [
        ("key", "密钥", "line", ""),
        ("iv", "IV", "line", ""),
        ("mode", "模式", "combo", ["CBC", "ECB"]),
        ("padding", "填充", "combo", ["PKCS7", "ZeroPadding", "NoPadding"]),
        ("output_encoding", "输出编码", "combo", ["base64", "hex"]),
        ("key_encoding", "密钥编码", "combo", ["utf-8", "hex", "base64"]),
    ],
    "RC4": [
        ("key", "密钥", "line", ""),
        ("output_encoding", "输出编码", "combo", ["base64", "hex"]),
        ("key_encoding", "密钥编码", "combo", ["utf-8", "hex", "base64"]),
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
        ("key", "密钥 (Hex)", "line", ""),
        ("iv", "IV (Hex)", "line", ""),
        ("mode", "模式", "combo", ["cbc", "ecb"]),
        ("output_encoding", "输出编码", "combo", ["hex", "base64"]),
    ],
    "Hash": [
        ("hash_algorithm", "哈希算法", "combo", ["md5", "sha1", "sha256", "sha512"]),
        ("output_encoding", "输出编码", "combo", ["hex", "base64"]),
    ],
    "HMAC": [
        ("key", "密钥", "line", ""),
        ("hash_algorithm", "哈希算法", "combo", ["md5", "sha1", "sha256", "sha512"]),
        ("output_encoding", "输出编码", "combo", ["hex", "base64"]),
    ],
    "Base64": [],
}

VISIBILITY_RULES = {
    "AES": {"ECB": {"iv": False}},
    "DES": {"ECB": {"iv": False}},
    "3DES": {"ECB": {"iv": False}},
    "RSA": {"public": {"private_key": False}, "private": {"public_key": False}},
}

TARGETS = [
    ("request_header", "请求头"),
    ("request_body", "请求体"),
    ("response_body", "响应体"),
]
MATCH_MODES = [
    ("all", "全部匹配"),
    ("contains", "包含"),
    ("equals", "等于"),
    ("regex", "正则匹配"),
    ("startswith", "前缀匹配"),
]
ACTIONS = [("encrypt", "加密"), ("decrypt", "解密")]
WRAPPERS = [
    ("none", "无"),
    ("double_quote", '双引号 "..."'),
    ("single_quote", "单引号 '...'"),
    ("custom", "自定义"),
]


class GatewayTab(QWidget):
    log_signal = pyqtSignal(str)
    request_remove = pyqtSignal(str)

    def __init__(self, config, gw_name: str, gateway_mgr):
        super().__init__()
        self.config = config
        self.gw_name = gw_name
        self.gateway_mgr = gateway_mgr
        self._param_widgets = {}
        self._param_labels = {}
        self._jsrpc_process = None
        self._init_ui()
        self._load_config()

    def _init_ui(self):
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        inner = QWidget()
        layout = QVBoxLayout(inner)
        layout.setSpacing(8)

        layout.addWidget(self._build_control_bar())
        layout.addWidget(self._build_network_group())
        layout.addWidget(self._build_crypto_group())
        layout.addWidget(self._build_match_group())
        layout.addWidget(self._build_test_group())
        layout.addStretch()

        scroll.setWidget(inner)
        outer = QVBoxLayout(self)
        outer.setContentsMargins(0, 0, 0, 0)
        outer.addWidget(scroll)

    # ── 控制栏 ──
    def _build_control_bar(self) -> QWidget:
        w = QWidget()
        layout = QHBoxLayout(w)
        layout.setContentsMargins(0, 0, 0, 0)

        self.btn_start = QPushButton("启动")
        self.btn_stop = QPushButton("停止")
        self.btn_stop.setEnabled(False)
        self.lbl_status = QLabel("● 已停止")
        self.lbl_status.setStyleSheet("color: gray;")
        btn_remove = QPushButton("删除此网关")
        btn_remove.setStyleSheet("color: red;")

        self.btn_start.clicked.connect(self._start)
        self.btn_stop.clicked.connect(self._stop)
        btn_remove.clicked.connect(lambda: self.request_remove.emit(self.gw_name))

        layout.addWidget(self.btn_start)
        layout.addWidget(self.btn_stop)
        layout.addWidget(self.lbl_status)
        layout.addStretch()
        layout.addWidget(btn_remove)
        return w

    def _start(self):
        self.gateway_mgr.start_gateway(self.gw_name)

    def _stop(self):
        self.gateway_mgr.stop_gateway(self.gw_name)

    def on_status_changed(self, running: bool):
        self.btn_start.setEnabled(not running)
        self.btn_stop.setEnabled(running)
        self.lbl_status.setText("● 运行中" if running else "● 已停止")
        self.lbl_status.setStyleSheet("color: green;" if running else "color: gray;")

    # ── 网络配置 ──
    def _build_network_group(self) -> QGroupBox:
        group = QGroupBox("网络配置")
        form = QFormLayout(group)

        gw = self.config.get_gateway(self.gw_name)

        self.cb_type = QComboBox()
        self.cb_type.addItem("解密", "decrypt")
        self.cb_type.addItem("加密", "encrypt")
        self.cb_type.addItem("加解密", "both")
        form.addRow("网关类型:", self.cb_type)

        self.input_port = QLineEdit()
        self.input_port.setPlaceholderText("8080")
        form.addRow("监听端口:", self.input_port)

        self.input_upstream = QLineEdit()
        self.input_upstream.setPlaceholderText("http://127.0.0.1:8082")
        form.addRow("上游代理:", self.input_upstream)

        self.cb_type.currentIndexChanged.connect(self._save_network)
        self.input_port.textChanged.connect(self._save_network)
        self.input_upstream.textChanged.connect(self._save_network)
        return group

    def _save_network(self):
        self.config.set_gateway_value(self.gw_name, "type", self.cb_type.currentData())
        try:
            port = int(self.input_port.text())
        except ValueError:
            port = 0
        self.config.set_gateway_value(self.gw_name, "network.listen_port", port)
        self.config.set_gateway_value(self.gw_name, "network.upstream_proxy", self.input_upstream.text())

    # ── 算法配置 ──
    def _build_crypto_group(self) -> QGroupBox:
        group = QGroupBox("算法配置")
        layout = QVBoxLayout(group)

        engine_layout = QHBoxLayout()
        engine_layout.addWidget(QLabel("引擎模式:"))
        self.cb_engine = QComboBox()
        self.cb_engine.addItem("本地 JS 引擎", "local")
        self.cb_engine.addItem("JSRPC 远程调用", "jsrpc")
        engine_layout.addWidget(self.cb_engine)
        engine_layout.addStretch()
        layout.addLayout(engine_layout)

        self.engine_stack = QStackedWidget()
        self.engine_stack.addWidget(self._build_local_widget())
        self.engine_stack.addWidget(self._build_jsrpc_widget())
        layout.addWidget(self.engine_stack)

        self.cb_engine.currentIndexChanged.connect(self._on_engine_changed)
        return group

    def _on_engine_changed(self, idx):
        self.engine_stack.setCurrentIndex(idx)
        is_jsrpc = self.cb_engine.currentData() == "jsrpc"
        self.config.set_gateway_value(self.gw_name, "crypto.engine", "jsrpc" if is_jsrpc else "local")
        self.config.set_gateway_value(self.gw_name, "jsrpc.enable", is_jsrpc)

    def _build_local_widget(self) -> QWidget:
        w = QWidget()
        layout = QVBoxLayout(w)
        layout.setContentsMargins(0, 0, 0, 0)

        algo_layout = QHBoxLayout()
        algo_layout.addWidget(QLabel("算法:"))
        self.cb_algorithm = QComboBox()
        for a in ALGORITHMS:
            self.cb_algorithm.addItem(a)
        algo_layout.addWidget(self.cb_algorithm)
        algo_layout.addStretch()
        layout.addLayout(algo_layout)

        self.params_form = QFormLayout()
        layout.addLayout(self.params_form)

        self.cb_algorithm.currentTextChanged.connect(self._on_algorithm_changed)
        return w

    def _on_algorithm_changed(self, algo: str):
        while self.params_form.rowCount() > 0:
            self.params_form.removeRow(0)
        self._param_widgets.clear()
        self._param_labels.clear()

        for key, label, wtype, default in ALGO_PARAMS.get(algo, []):
            lbl = QLabel(f"{label}:")
            if wtype == "combo":
                widget = QComboBox()
                for item in default:
                    widget.addItem(item)
                widget.currentTextChanged.connect(self._save_crypto_params)
            elif wtype == "text":
                widget = QTextEdit()
                widget.setMaximumHeight(60)
                widget.textChanged.connect(self._save_crypto_params)
            else:
                widget = QLineEdit()
                widget.textChanged.connect(self._save_crypto_params)
            self._param_widgets[key] = widget
            self._param_labels[key] = lbl
            self.params_form.addRow(lbl, widget)

        self._apply_visibility(algo)
        self.config.set_gateway_value(self.gw_name, "crypto.algorithm", algo)
        self._save_crypto_params()

    def _apply_visibility(self, algo: str):
        rules = VISIBILITY_RULES.get(algo, {})
        for trigger_key, field_map in rules.items():
            widget = self._param_widgets.get("mode") or self._param_widgets.get("encrypt_with")
            if widget and isinstance(widget, QComboBox):
                widget.currentTextChanged.connect(
                    lambda val, a=algo: self._update_field_visibility(a)
                )
        self._update_field_visibility(algo)

    def _update_field_visibility(self, algo: str):
        rules = VISIBILITY_RULES.get(algo, {})
        all_fields = set()
        for field_map in rules.values():
            all_fields.update(field_map.keys())
        for f in all_fields:
            if f in self._param_widgets:
                self._param_widgets[f].setVisible(True)
                self._param_labels[f].setVisible(True)

        for trigger_val, field_map in rules.items():
            trigger_widget = self._param_widgets.get("mode") or self._param_widgets.get("encrypt_with")
            if trigger_widget and isinstance(trigger_widget, QComboBox):
                if trigger_widget.currentText() == trigger_val:
                    for field, visible in field_map.items():
                        if field in self._param_widgets:
                            self._param_widgets[field].setVisible(visible)
                            self._param_labels[field].setVisible(visible)

    def _save_crypto_params(self):
        params = {}
        for key, widget in self._param_widgets.items():
            if isinstance(widget, QComboBox):
                params[key] = widget.currentText()
            elif isinstance(widget, QTextEdit):
                params[key] = widget.toPlainText()
            else:
                params[key] = widget.text()
        self.config.set_gateway_value(self.gw_name, "crypto.params", params)

    # ── JSRPC 配置 ──
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

    def _save_jsrpc(self):
        self.config.set_gateway_value(self.gw_name, "jsrpc.url", self.jsrpc_url.text())
        self.config.set_gateway_value(self.gw_name, "jsrpc.group", self.jsrpc_group.text())
        self.config.set_gateway_value(self.gw_name, "jsrpc.encrypt_func", self.jsrpc_encrypt_func.text() or "encrypt")
        self.config.set_gateway_value(self.gw_name, "jsrpc.decrypt_func", self.jsrpc_decrypt_func.text() or "decrypt")
        try:
            timeout = int(self.jsrpc_timeout.text())
        except ValueError:
            timeout = 5
        self.config.set_gateway_value(self.gw_name, "jsrpc.timeout", timeout)

    def _toggle_jsrpc(self):
        if self._jsrpc_process and self._jsrpc_process.state() == QProcess.Running:
            self._jsrpc_process.kill()
            self._jsrpc_process.waitForFinished(2000)
            self._jsrpc_process = None
            self.btn_jsrpc_toggle.setText("启动 JSRPC 服务")
            self.jsrpc_status_label.setText("已停止")
            self.jsrpc_status_label.setStyleSheet("color: #666; font-size: 9pt;")
            self.log_signal.emit("[JSRPC] 服务已停止")
            return

        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        exe_path = os.path.join(project_root, "jsrpc.exe")
        if not os.path.exists(exe_path):
            self.jsrpc_status_label.setText("jsrpc.exe 不存在")
            self.jsrpc_status_label.setStyleSheet("color: red; font-size: 9pt;")
            self.log_signal.emit(f"[JSRPC] 文件不存在: {exe_path}")
            return

        self._jsrpc_process = QProcess(self)
        self._jsrpc_process.setWorkingDirectory(project_root)
        self._jsrpc_process.setProgram(exe_path)
        self._jsrpc_process.setProcessChannelMode(QProcess.MergedChannels)
        self._jsrpc_process.readyReadStandardOutput.connect(self._read_jsrpc_output)
        self._jsrpc_process.finished.connect(self._on_jsrpc_finished)
        self._jsrpc_process.errorOccurred.connect(self._on_jsrpc_error)
        self._jsrpc_process.start()

        self.log_signal.emit(f"[JSRPC] 正在启动: {exe_path}")
        if self._jsrpc_process.waitForStarted(3000):
            self.btn_jsrpc_toggle.setText("停止 JSRPC 服务")
            self.jsrpc_status_label.setText("运行中")
            self.jsrpc_status_label.setStyleSheet("color: green; font-size: 9pt;")
            self.log_signal.emit("[JSRPC] 服务已启动")
        else:
            err = self._jsrpc_process.errorString()
            self.jsrpc_status_label.setText("启动失败")
            self.jsrpc_status_label.setStyleSheet("color: red; font-size: 9pt;")
            self.log_signal.emit(f"[JSRPC] 启动失败: {err}")
            self._jsrpc_process = None

    def _read_jsrpc_output(self):
        if not self._jsrpc_process:
            return
        data = self._jsrpc_process.readAllStandardOutput()
        text = bytes(data).decode("utf-8", errors="replace").strip()
        if text:
            for line in text.splitlines():
                self.log_signal.emit(f"[JSRPC] {line}")

    def _on_jsrpc_error(self, error):
        error_map = {
            QProcess.FailedToStart: "无法启动进程",
            QProcess.Crashed: "进程崩溃",
            QProcess.Timedout: "超时",
        }
        self.log_signal.emit(f"[JSRPC] 错误: {error_map.get(error, str(error))}")

    def _on_jsrpc_finished(self, exit_code, exit_status):
        self.log_signal.emit(f"[JSRPC] 进程退出 (code={exit_code})")
        self._jsrpc_process = None
        self.btn_jsrpc_toggle.setText("启动 JSRPC 服务")
        self.jsrpc_status_label.setText("已停止")
        self.jsrpc_status_label.setStyleSheet("color: #666; font-size: 9pt;")

    # ── 匹配规则 ──
    def _build_match_group(self) -> QGroupBox:
        group = QGroupBox("数据匹配规则")
        layout = QVBoxLayout(group)

        add_form = QFormLayout()
        self.cb_target = QComboBox()
        for val, label in TARGETS:
            self.cb_target.addItem(label, val)
        add_form.addRow("匹配位置:", self.cb_target)
        self.cb_target.currentIndexChanged.connect(self._on_target_changed)

        self.input_header_name = QLineEdit()
        self.input_header_name.setPlaceholderText("如 Content-Type")
        self.lbl_header_name = QLabel("Header 名称:")
        add_form.addRow(self.lbl_header_name, self.input_header_name)

        self.cb_match_mode = QComboBox()
        for val, label in MATCH_MODES:
            self.cb_match_mode.addItem(label, val)
        add_form.addRow("匹配方式:", self.cb_match_mode)
        self.cb_match_mode.currentIndexChanged.connect(self._on_match_mode_changed)

        self.input_keyword = QLineEdit()
        self.input_keyword.setPlaceholderText("匹配关键字或正则表达式")
        self.lbl_keyword = QLabel("关键字:")
        add_form.addRow(self.lbl_keyword, self.input_keyword)

        self.cb_action = QComboBox()
        for val, label in ACTIONS:
            self.cb_action.addItem(label, val)
        add_form.addRow("执行操作:", self.cb_action)

        self.cb_wrapper = QComboBox()
        for val, label in WRAPPERS:
            self.cb_wrapper.addItem(label, val)
        add_form.addRow("包裹符:", self.cb_wrapper)
        self.cb_wrapper.currentIndexChanged.connect(self._on_wrapper_changed)

        self.input_wrapper_prefix = QLineEdit()
        self.lbl_wrapper_prefix = QLabel("自定义前缀:")
        add_form.addRow(self.lbl_wrapper_prefix, self.input_wrapper_prefix)
        self.input_wrapper_suffix = QLineEdit()
        self.lbl_wrapper_suffix = QLabel("自定义后缀:")
        add_form.addRow(self.lbl_wrapper_suffix, self.input_wrapper_suffix)

        btn_add = QPushButton("添加规则")
        btn_add.clicked.connect(self._add_rule)
        add_form.addRow("", btn_add)
        layout.addLayout(add_form)

        self._on_target_changed()
        self._on_wrapper_changed()
        self._on_match_mode_changed()

        self.rule_table = QTableWidget(0, 6)
        self.rule_table.setHorizontalHeaderLabels(
            ["匹配位置", "Header", "匹配方式", "关键字", "操作", "包裹符"])
        self.rule_table.horizontalHeader().setSectionResizeMode(3, QHeaderView.Stretch)
        self.rule_table.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.rule_table.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.rule_table.setMaximumHeight(150)
        layout.addWidget(self.rule_table)

        tbl_btn = QHBoxLayout()
        btn_rm = QPushButton("删除选中")
        btn_rm.clicked.connect(self._remove_rule)
        btn_clr = QPushButton("清空全部")
        btn_clr.clicked.connect(self._clear_rules)
        tbl_btn.addStretch()
        tbl_btn.addWidget(btn_rm)
        tbl_btn.addWidget(btn_clr)
        layout.addLayout(tbl_btn)
        return group

    def _on_target_changed(self):
        is_header = self.cb_target.currentData() == "request_header"
        self.input_header_name.setVisible(is_header)
        self.lbl_header_name.setVisible(is_header)

    def _on_match_mode_changed(self):
        is_all = self.cb_match_mode.currentData() == "all"
        self.input_keyword.setVisible(not is_all)
        self.lbl_keyword.setVisible(not is_all)

    def _on_wrapper_changed(self):
        is_custom = self.cb_wrapper.currentData() == "custom"
        self.input_wrapper_prefix.setVisible(is_custom)
        self.lbl_wrapper_prefix.setVisible(is_custom)
        self.input_wrapper_suffix.setVisible(is_custom)
        self.lbl_wrapper_suffix.setVisible(is_custom)

    def _get_wrapper_config(self) -> dict:
        wtype = self.cb_wrapper.currentData()
        if wtype == "double_quote":
            return {"prefix": '"', "suffix": '"'}
        elif wtype == "single_quote":
            return {"prefix": "'", "suffix": "'"}
        elif wtype == "custom":
            return {
                "prefix": self.input_wrapper_prefix.text(),
                "suffix": self.input_wrapper_suffix.text(),
            }
        return {"prefix": "", "suffix": ""}

    def _add_rule(self):
        target = self.cb_target.currentData()
        match_mode = self.cb_match_mode.currentData()
        keyword = self.input_keyword.text().strip()
        header_name = self.input_header_name.text().strip()
        if match_mode != "all" and not keyword:
            return
        if target == "request_header" and not header_name:
            return
        wrapper = self._get_wrapper_config()
        rule = {
            "target": target,
            "header_name": header_name if target == "request_header" else "",
            "match_mode": match_mode,
            "keyword": keyword,
            "action": self.cb_action.currentData(),
            "wrapper_prefix": wrapper["prefix"],
            "wrapper_suffix": wrapper["suffix"],
        }
        self._append_table_row(rule)
        self._save_rules()
        self.input_keyword.clear()
        self.input_header_name.clear()

    def _append_table_row(self, rule: dict):
        row = self.rule_table.rowCount()
        self.rule_table.insertRow(row)
        t_item = QTableWidgetItem(dict(TARGETS).get(rule["target"], rule["target"]))
        t_item.setData(Qt.UserRole, rule["target"])
        self.rule_table.setItem(row, 0, t_item)
        self.rule_table.setItem(row, 1, QTableWidgetItem(rule.get("header_name", "")))
        m_item = QTableWidgetItem(dict(MATCH_MODES).get(rule["match_mode"], rule["match_mode"]))
        m_item.setData(Qt.UserRole, rule["match_mode"])
        self.rule_table.setItem(row, 2, m_item)
        self.rule_table.setItem(row, 3, QTableWidgetItem(rule["keyword"]))
        a_item = QTableWidgetItem(dict(ACTIONS).get(rule["action"], rule["action"]))
        a_item.setData(Qt.UserRole, rule["action"])
        self.rule_table.setItem(row, 4, a_item)
        p = rule.get("wrapper_prefix", "")
        s = rule.get("wrapper_suffix", "")
        disp = "无" if not p and not s else f"{p}...{s}"
        w_item = QTableWidgetItem(disp)
        w_item.setData(Qt.UserRole, f"{p}|{s}")
        self.rule_table.setItem(row, 5, w_item)

    def _remove_rule(self):
        rows = sorted(set(idx.row() for idx in self.rule_table.selectedIndexes()), reverse=True)
        for row in rows:
            self.rule_table.removeRow(row)
        self._save_rules()

    def _clear_rules(self):
        self.rule_table.setRowCount(0)
        self._save_rules()

    def _save_rules(self):
        rules = []
        for row in range(self.rule_table.rowCount()):
            wrapper_data = self.rule_table.item(row, 5).data(Qt.UserRole) or "|"
            parts = wrapper_data.split("|", 1)
            rules.append({
                "target": self.rule_table.item(row, 0).data(Qt.UserRole),
                "header_name": self.rule_table.item(row, 1).text(),
                "match_mode": self.rule_table.item(row, 2).data(Qt.UserRole),
                "keyword": self.rule_table.item(row, 3).text(),
                "action": self.rule_table.item(row, 4).data(Qt.UserRole),
                "wrapper_prefix": parts[0] if len(parts) > 0 else "",
                "wrapper_suffix": parts[1] if len(parts) > 1 else "",
            })
        self.config.set_gateway_value(self.gw_name, "match_rules", rules)

    # ── 测试加解密 ──
    def _build_test_group(self) -> QGroupBox:
        group = QGroupBox("测试加解密")
        layout = QVBoxLayout(group)

        self.test_input = QTextEdit()
        self.test_input.setPlaceholderText("输入明文或密文...")
        self.test_input.setMaximumHeight(80)
        layout.addWidget(self.test_input)

        btn_layout = QHBoxLayout()
        btn_enc = QPushButton("加密")
        btn_dec = QPushButton("解密")
        btn_swap = QPushButton("交换")
        btn_enc.clicked.connect(self._test_encrypt)
        btn_dec.clicked.connect(self._test_decrypt)
        btn_swap.clicked.connect(self._test_swap)
        btn_layout.addWidget(btn_enc)
        btn_layout.addWidget(btn_dec)
        btn_layout.addWidget(btn_swap)
        btn_layout.addStretch()
        layout.addLayout(btn_layout)

        self.test_output = QTextEdit()
        self.test_output.setReadOnly(True)
        self.test_output.setMaximumHeight(80)
        layout.addWidget(self.test_output)

        self.test_status = QLabel("")
        self.test_status.setStyleSheet("color: #666; font-size: 8pt;")
        layout.addWidget(self.test_status)
        return group

    def _get_test_crypto(self):
        from core.crypto_service import JSEngine, JSRPCEngine
        gw = self.config.get_gateway(self.gw_name)
        crypto = gw.get("crypto", {})
        jsrpc_cfg = gw.get("jsrpc", {})

        if crypto.get("engine") == "jsrpc" and jsrpc_cfg.get("enable"):
            rpc = JSRPCEngine(
                url=jsrpc_cfg.get("url", ""),
                timeout=jsrpc_cfg.get("timeout", 5))
            return "jsrpc", rpc, jsrpc_cfg
        return "local", JSEngine(), crypto

    def _test_encrypt(self):
        text = self.test_input.toPlainText()
        if not text:
            return
        try:
            mode, engine, cfg = self._get_test_crypto()
            if mode == "jsrpc":
                result = engine.call(
                    cfg.get("group", ""),
                    cfg.get("encrypt_func", "encrypt"), text)
            else:
                result = engine.call(
                    "encrypt", cfg.get("algorithm", "AES"),
                    text, cfg.get("params", {}))
            self.test_output.setPlainText(result)
            self.test_status.setText("加密成功")
            self.test_status.setStyleSheet("color: green; font-size: 8pt;")
        except Exception as e:
            self.test_output.setPlainText("")
            self.test_status.setText(f"加密失败: {e}")
            self.test_status.setStyleSheet("color: red; font-size: 8pt;")

    def _test_decrypt(self):
        text = self.test_input.toPlainText()
        if not text:
            return
        try:
            mode, engine, cfg = self._get_test_crypto()
            if mode == "jsrpc":
                result = engine.call(
                    cfg.get("group", ""),
                    cfg.get("decrypt_func", "decrypt"), text)
            else:
                result = engine.call(
                    "decrypt", cfg.get("algorithm", "AES"),
                    text, cfg.get("params", {}))
            self.test_output.setPlainText(result)
            self.test_status.setText("解密成功")
            self.test_status.setStyleSheet("color: green; font-size: 8pt;")
        except Exception as e:
            self.test_output.setPlainText("")
            self.test_status.setText(f"解密失败: {e}")
            self.test_status.setStyleSheet("color: red; font-size: 8pt;")

    def _test_swap(self):
        i = self.test_input.toPlainText()
        o = self.test_output.toPlainText()
        self.test_input.setPlainText(o)
        self.test_output.setPlainText(i)

    # ── 加载配置 ──
    def _load_config(self):
        gw = self.config.get_gateway(self.gw_name)

        idx = self.cb_type.findData(gw.get("type", "decrypt"))
        if idx >= 0:
            self.cb_type.setCurrentIndex(idx)
        self.input_port.setText(str(gw["network"]["listen_port"]))
        self.input_upstream.setText(gw["network"].get("upstream_proxy", ""))

        crypto = gw.get("crypto", {})
        if crypto.get("engine") == "jsrpc":
            self.cb_engine.setCurrentIndex(1)
        else:
            self.cb_engine.setCurrentIndex(0)

        algo = crypto.get("algorithm", "AES")
        idx = self.cb_algorithm.findText(algo)
        if idx >= 0:
            self.cb_algorithm.setCurrentIndex(idx)
        self._on_algorithm_changed(algo)

        params = crypto.get("params", {})
        for key, val in params.items():
            w = self._param_widgets.get(key)
            if w is None:
                continue
            if isinstance(w, QComboBox):
                i = w.findText(str(val))
                if i >= 0:
                    w.setCurrentIndex(i)
            elif isinstance(w, QTextEdit):
                w.setPlainText(str(val))
            else:
                w.setText(str(val))

        jsrpc = gw.get("jsrpc", {})
        self.jsrpc_url.setText(jsrpc.get("url", ""))
        self.jsrpc_group.setText(jsrpc.get("group", ""))
        self.jsrpc_encrypt_func.setText(jsrpc.get("encrypt_func", "encrypt"))
        self.jsrpc_decrypt_func.setText(jsrpc.get("decrypt_func", "decrypt"))
        self.jsrpc_timeout.setText(str(jsrpc.get("timeout", 5)))

        for rule in gw.get("match_rules", []):
            self._append_table_row(rule)

    def cleanup(self):
        if self._jsrpc_process and self._jsrpc_process.state() == QProcess.Running:
            self._jsrpc_process.kill()
            self._jsrpc_process.waitForFinished(2000)
