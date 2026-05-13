"""单个网关的完整配置标签页"""

import os
from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QFormLayout, QGroupBox,
    QComboBox, QLineEdit, QTextEdit, QLabel, QPushButton,
    QStackedWidget, QScrollArea
)
from PyQt5.QtCore import Qt, QProcess, pyqtSignal
from gui.match_dialog import MatchRulesDialog
from gui.network_dialog import NetworkDialog
from gui.algo_params import ALGORITHMS, ALGO_PARAMS


VISIBILITY_RULES = {
    "AES": {"ECB": {"iv": False}},
    "DES": {"ECB": {"iv": False}},
    "3DES": {"ECB": {"iv": False}},
    "RSA": {"public": {"private_key": False}, "private": {"public_key": False}},
}


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

        self.network_bar = self._build_network_bar()
        layout.addWidget(self.network_bar)
        self.crypto_group = self._build_crypto_group()
        layout.addWidget(self.crypto_group)

        self.match_bar = self._build_match_bar()
        layout.addWidget(self.match_bar)
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

        self.btn_start = QPushButton("  启动  ")
        self.btn_start.setStyleSheet(
            "QPushButton { background-color: #a6e3a1; color: #1e1e2e; font-weight: bold; }"
            "QPushButton:hover { background-color: #94e2d5; }"
            "QPushButton:disabled { background-color: #313244; color: #585b70; }")
        self.btn_stop = QPushButton("  停止  ")
        self.btn_stop.setStyleSheet(
            "QPushButton { background-color: #f38ba8; color: #1e1e2e; font-weight: bold; }"
            "QPushButton:hover { background-color: #eba0ac; }"
            "QPushButton:disabled { background-color: #313244; color: #585b70; }")
        self.btn_stop.setEnabled(False)
        self.lbl_status = QLabel("  ● 已停止")
        self.lbl_status.setStyleSheet("color: #6c7086; font-weight: bold;")
        btn_remove = QPushButton("删除此网关")
        btn_remove.setStyleSheet(
            "QPushButton { background-color: transparent; color: #f38ba8; border: 1px solid #f38ba8; }"
            "QPushButton:hover { background-color: #f38ba8; color: #1e1e2e; }")

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
        if running:
            self.lbl_status.setText("  ● 运行中")
            self.lbl_status.setStyleSheet("color: #a6e3a1; font-weight: bold;")
        else:
            self.lbl_status.setText("  ● 已停止")
            self.lbl_status.setStyleSheet("color: #6c7086; font-weight: bold;")
        self._set_config_locked(running)

    def _set_config_locked(self, locked: bool):
        self.network_bar.setEnabled(not locked)
        self.crypto_group.setEnabled(not locked)
        self.match_bar.setEnabled(not locked)

    # ── 网络配置 ──
    def _build_network_bar(self) -> QWidget:
        w = QWidget()
        layout = QHBoxLayout(w)
        layout.setContentsMargins(0, 0, 0, 0)

        self.btn_network = QPushButton("  网络配置  ")
        self.btn_network.setStyleSheet(
            "QPushButton { background-color: #45475a; color: #cdd6f4; font-weight: bold; "
            "border: 1px solid #585b70; border-radius: 4px; padding: 8px 20px; }"
            "QPushButton:hover { background-color: #585b70; }"
            "QPushButton:disabled { background-color: #313244; color: #585b70; }")
        self.btn_network.clicked.connect(self._open_network_dialog)

        self.lbl_network_summary = QLabel("")
        self.lbl_network_summary.setStyleSheet("color: #a6adc8;")

        layout.addWidget(self.btn_network)
        layout.addWidget(self.lbl_network_summary)
        layout.addStretch()
        return w

    def _open_network_dialog(self):
        gw = self.config.get_gateway(self.gw_name)
        dlg = NetworkDialog(gw, self)
        if dlg.exec_() == NetworkDialog.Accepted:
            result = dlg.get_config()
            self.config.set_gateway_value(self.gw_name, "type", result["type"])
            self.config.set_gateway_value(self.gw_name, "network.listen_port", result["network"]["listen_port"])
            self.config.set_gateway_value(self.gw_name, "network.upstream_proxy", result["network"]["upstream_proxy"])
            self._update_network_summary()
            self._hot_reload_config()

    def _update_network_summary(self):
        gw = self.config.get_gateway(self.gw_name)
        type_map = {"decrypt": "解密", "encrypt": "加密", "both": "加解密"}
        gw_type = type_map.get(gw.get("type", "decrypt"), gw.get("type"))
        port = gw["network"]["listen_port"]
        upstream = gw["network"].get("upstream_proxy", "")
        parts = [f"类型: {gw_type}", f"端口: {port}"]
        if upstream:
            parts.append(f"上游: {upstream}")
        self.lbl_network_summary.setText("    ".join(parts))

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
        self.jsrpc_status_label.setStyleSheet("color: #6c7086;")
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
            self.jsrpc_status_label.setStyleSheet("color: #6c7086;")
            self.log_signal.emit("[JSRPC] 服务已停止")
            return

        from core.path_utils import get_project_root
        project_root = get_project_root()
        exe_path = os.path.join(project_root, "jsrpc.exe")
        if not os.path.exists(exe_path):
            self.jsrpc_status_label.setText("jsrpc.exe 不存在")
            self.jsrpc_status_label.setStyleSheet("color: #f38ba8;")
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
            self.jsrpc_status_label.setStyleSheet("color: #a6e3a1;")
            self.log_signal.emit("[JSRPC] 服务已启动")
        else:
            err = self._jsrpc_process.errorString()
            self.jsrpc_status_label.setText("启动失败")
            self.jsrpc_status_label.setStyleSheet("color: #f38ba8;")
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
        self.jsrpc_status_label.setStyleSheet("color: #6c7086;")

    # ── 匹配规则 ──
    def _build_match_bar(self) -> QWidget:
        w = QWidget()
        layout = QHBoxLayout(w)
        layout.setContentsMargins(0, 0, 0, 0)

        self.btn_match_rules = QPushButton("  配置匹配规则 (0 条)  ")
        self.btn_match_rules.setStyleSheet(
            "QPushButton { background-color: #45475a; color: #cdd6f4; font-weight: bold; "
            "border: 1px solid #585b70; border-radius: 4px; padding: 8px 20px; }"
            "QPushButton:hover { background-color: #585b70; }"
            "QPushButton:disabled { background-color: #313244; color: #585b70; }")
        self.btn_match_rules.clicked.connect(self._open_match_dialog)
        layout.addWidget(self.btn_match_rules)
        layout.addStretch()
        return w

    def _open_match_dialog(self):
        gw = self.config.get_gateway(self.gw_name)
        rules = gw.get("match_rules", [])
        gw_type = gw.get("type", "both")
        dlg = MatchRulesDialog(rules, gw_type, self)
        if dlg.exec_() == MatchRulesDialog.Accepted:
            new_rules = dlg.get_rules()
            self.config.set_gateway_value(self.gw_name, "match_rules", new_rules)
            self._update_match_count()
            self._hot_reload_config()

    def _update_match_count(self):
        gw = self.config.get_gateway(self.gw_name)
        count = len(gw.get("match_rules", []))
        self.btn_match_rules.setText(f"  配置匹配规则 ({count} 条)  ")

    def _hot_reload_config(self):
        if self.gateway_mgr.is_running(self.gw_name):
            self.gateway_mgr.stop_gateway(self.gw_name)
            self.gateway_mgr.start_gateway(self.gw_name)
            self.log_signal.emit(f"[{self.gw_name}] 配置已更新，网关已自动重启")

    # ── 测试加解密 ──
    def _build_test_group(self) -> QGroupBox:
        group = QGroupBox("测试加解密")
        layout = QVBoxLayout(group)

        rule_layout = QHBoxLayout()
        rule_layout.addWidget(QLabel("使用规则:"))
        self.cb_test_rule = QComboBox()
        self.cb_test_rule.addItem("全局算法配置", "global")
        rule_layout.addWidget(self.cb_test_rule, 1)
        btn_refresh = QPushButton("刷新")
        btn_refresh.clicked.connect(self._refresh_test_rules)
        rule_layout.addWidget(btn_refresh)
        layout.addLayout(rule_layout)

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
        self.test_status.setStyleSheet("color: #6c7086;")
        layout.addWidget(self.test_status)
        return group

    def _refresh_test_rules(self):
        self.cb_test_rule.clear()
        self.cb_test_rule.addItem("全局算法配置", "global")
        gw = self.config.get_gateway(self.gw_name)
        rules = gw.get("match_rules", [])
        from gui.match_dialog import TARGET_MAP
        for i, rule in enumerate(rules):
            target_label = TARGET_MAP.get(rule.get("target", ""), rule.get("target", ""))
            if rule.get("target") == "chain":
                steps = rule.get("chain_steps", [])
                algos = [s.get("algorithm", "") for s in steps if s.get("algorithm")]
                algo = "→".join(algos) if algos else "链式"
                action_label = f"{len(steps)}步"
            else:
                algo = rule.get("algorithm", "") or rule.get("data_algorithm", "")
                action_label = "加密" if rule.get("action") == "encrypt" else "解密"
            label = f"规则{i+1}: {target_label} / {algo} / {action_label}"
            self.cb_test_rule.addItem(label, i)

    def _get_test_crypto(self):
        from core.crypto_service import JSEngine, JSRPCEngine
        gw = self.config.get_gateway(self.gw_name)
        crypto = gw.get("crypto", {})
        jsrpc_cfg = gw.get("jsrpc", {})

        rule_idx = self.cb_test_rule.currentData()
        if rule_idx != "global" and rule_idx is not None:
            rules = gw.get("match_rules", [])
            if 0 <= rule_idx < len(rules):
                rule = rules[rule_idx]
                if rule.get("target") == "chain":
                    return "chain", None, {"chain_steps": rule.get("chain_steps", []), "jsrpc": jsrpc_cfg}
                algo = rule.get("algorithm", "") or rule.get("data_algorithm", "")
                params = rule.get("algorithm_params", {}) or rule.get("data_params", {})
                if algo:
                    return "rule", JSEngine(), {"algorithm": algo, "params": params}

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
            if mode == "chain":
                result = self._run_test_chain(text, cfg)
            elif mode == "jsrpc":
                result = engine.call(
                    cfg.get("group", ""),
                    cfg.get("encrypt_func", "encrypt"), text)
            elif mode == "rule":
                result = engine.call(
                    "encrypt", cfg.get("algorithm", "AES"),
                    text, cfg.get("params", {}))
            else:
                result = engine.call(
                    "encrypt", cfg.get("algorithm", "AES"),
                    text, cfg.get("params", {}))
            self.test_output.setPlainText(result)
            self.test_status.setText("加密成功")
            self.test_status.setStyleSheet("color: #a6e3a1;")
        except Exception as e:
            self.test_output.setPlainText("")
            self.test_status.setText(f"加密失败: {e}")
            self.test_status.setStyleSheet("color: #f38ba8;")

    def _test_decrypt(self):
        text = self.test_input.toPlainText()
        if not text:
            return
        try:
            mode, engine, cfg = self._get_test_crypto()
            if mode == "chain":
                result = self._run_test_chain(text, cfg)
            elif mode == "jsrpc":
                result = engine.call(
                    cfg.get("group", ""),
                    cfg.get("decrypt_func", "decrypt"), text)
            elif mode == "rule":
                result = engine.call(
                    "decrypt", cfg.get("algorithm", "AES"),
                    text, cfg.get("params", {}))
            else:
                result = engine.call(
                    "decrypt", cfg.get("algorithm", "AES"),
                    text, cfg.get("params", {}))
            self.test_output.setPlainText(result)
            self.test_status.setText("解密成功")
            self.test_status.setStyleSheet("color: #a6e3a1;")
        except Exception as e:
            self.test_output.setPlainText("")
            self.test_status.setText(f"解密失败: {e}")
            self.test_status.setStyleSheet("color: #f38ba8;")

    def _run_test_chain(self, text, cfg):
        from core.chain_processor import process_chain
        from core.crypto_service import GatewayCryptoService, JSRPCEngine
        steps = cfg.get("chain_steps", [])
        jsrpc_cfg = cfg.get("jsrpc", {})
        gw = self.config.get_gateway(self.gw_name)
        crypto_svc = GatewayCryptoService(gw)
        if jsrpc_cfg.get("enable"):
            crypto_svc._jsrpc = JSRPCEngine(
                url=jsrpc_cfg.get("url", ""),
                timeout=jsrpc_cfg.get("timeout", 5))
        result = process_chain(text, steps, crypto_svc)
        return result

    def _test_swap(self):
        i = self.test_input.toPlainText()
        o = self.test_output.toPlainText()
        self.test_input.setPlainText(o)
        self.test_output.setPlainText(i)

    # ── 加载配置 ──
    def _load_config(self):
        gw = self.config.get_gateway(self.gw_name)

        self._update_network_summary()

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

        self._update_match_count()

    def cleanup(self):
        if self._jsrpc_process and self._jsrpc_process.state() == QProcess.Running:
            self._jsrpc_process.kill()
            self._jsrpc_process.waitForFinished(2000)
