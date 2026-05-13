"""数据匹配规则弹出窗口"""

import json
from PyQt5.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QFormLayout,
    QComboBox, QLineEdit, QLabel, QPushButton, QTextEdit,
    QTableWidget, QTableWidgetItem, QHeaderView, QAbstractItemView,
    QGroupBox, QWidget
)
from PyQt5.QtCore import Qt
from gui.algo_params import ALGORITHMS, ALGO_PARAMS

TARGETS = [
    ("request_header", "请求头"),
    ("request_body", "请求体"),
    ("response_body", "响应体"),
    ("query_param_all", "GET参数(全部)"),
    ("query_param", "GET参数(指定)"),
    ("response_json_field", "响应JSON字段"),
    ("chain", "链式处理"),
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

TARGET_MAP = dict(TARGETS)
MODE_MAP = dict(MATCH_MODES)
ACTION_MAP = dict(ACTIONS)


class AlgoParamsDialog(QDialog):
    """弹出窗口：根据算法动态生成参数表单"""

    def __init__(self, algorithm: str, current_params: dict = None, parent=None):
        super().__init__(parent)
        self.setWindowTitle(f"{algorithm} 参数配置")
        self.setMinimumWidth(420)
        self._params = dict(current_params or {})
        self._widgets = {}
        self._init_ui(algorithm)

    def _init_ui(self, algorithm: str):
        layout = QVBoxLayout(self)
        form = QFormLayout()
        form.setSpacing(6)

        fields = ALGO_PARAMS.get(algorithm, [])
        for key, label, widget_type, default in fields:
            if widget_type == "combo":
                w = QComboBox()
                for opt in default:
                    w.addItem(str(opt), str(opt))
                saved = self._params.get(key, "")
                idx = w.findData(str(saved))
                if idx >= 0:
                    w.setCurrentIndex(idx)
                self._widgets[key] = ("combo", w)
            elif widget_type == "text":
                w = QTextEdit()
                w.setMaximumHeight(60)
                w.setPlainText(str(self._params.get(key, default or "")))
                self._widgets[key] = ("text", w)
            else:
                w = QLineEdit()
                w.setText(str(self._params.get(key, default or "")))
                self._widgets[key] = ("line", w)
            form.addRow(f"{label}:", w)

        layout.addLayout(form)

        btns = QHBoxLayout()
        btns.addStretch()
        btn_ok = QPushButton("  确定  ")
        btn_ok.setStyleSheet(
            "QPushButton { background-color: #a6e3a1; color: #1e1e2e; font-weight: bold; }"
            "QPushButton:hover { background-color: #94e2d5; }")
        btn_cancel = QPushButton("  取消  ")
        btn_ok.clicked.connect(self.accept)
        btn_cancel.clicked.connect(self.reject)
        btns.addWidget(btn_ok)
        btns.addWidget(btn_cancel)
        layout.addLayout(btns)

    def get_params(self) -> dict:
        result = {}
        for key, (wtype, widget) in self._widgets.items():
            if wtype == "combo":
                result[key] = widget.currentData()
            elif wtype == "text":
                result[key] = widget.toPlainText().strip()
            else:
                val = widget.text().strip()
                if val:
                    result[key] = val
        return result


class MatchRulesDialog(QDialog):
    def __init__(self, rules: list, gw_type: str = "both", parent=None):
        super().__init__(parent)
        self.setWindowTitle("数据匹配规则")
        self.setMinimumSize(700, 500)
        self._gw_type = gw_type
        self._result_rules = list(rules)
        self._init_ui()
        self._load_rules(rules)

    def _init_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(8)

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

        self.input_param_name = QLineEdit()
        self.input_param_name.setPlaceholderText("如 username")
        self.lbl_param_name = QLabel("参数名称:")
        add_form.addRow(self.lbl_param_name, self.input_param_name)

        self.cb_match_mode = QComboBox()
        for val, label in MATCH_MODES:
            self.cb_match_mode.addItem(label, val)
        self.lbl_match_mode = QLabel("匹配方式:")
        add_form.addRow(self.lbl_match_mode, self.cb_match_mode)
        self.cb_match_mode.currentIndexChanged.connect(self._on_match_mode_changed)

        self.input_keyword = QLineEdit()
        self.input_keyword.setPlaceholderText("匹配关键字或正则表达式")
        self.lbl_keyword = QLabel("关键字:")
        add_form.addRow(self.lbl_keyword, self.input_keyword)

        self.cb_action = QComboBox()
        if self._gw_type == "encrypt":
            self.cb_action.addItem("加密", "encrypt")
        elif self._gw_type == "decrypt":
            self.cb_action.addItem("解密", "decrypt")
        else:
            for val, label in ACTIONS:
                self.cb_action.addItem(label, val)
        self.lbl_action = QLabel("执行操作:")
        add_form.addRow(self.lbl_action, self.cb_action)

        self.cb_wrapper = QComboBox()
        for val, label in WRAPPERS:
            self.cb_wrapper.addItem(label, val)
        self.lbl_wrapper = QLabel("包裹符:")
        add_form.addRow(self.lbl_wrapper, self.cb_wrapper)
        self.cb_wrapper.currentIndexChanged.connect(self._on_wrapper_changed)

        self.input_wrapper_prefix = QLineEdit()
        self.lbl_wrapper_prefix = QLabel("自定义前缀:")
        add_form.addRow(self.lbl_wrapper_prefix, self.input_wrapper_prefix)
        self.input_wrapper_suffix = QLineEdit()
        self.lbl_wrapper_suffix = QLabel("自定义后缀:")
        add_form.addRow(self.lbl_wrapper_suffix, self.input_wrapper_suffix)

        self.cb_rule_algorithm = QComboBox()
        for a in ALGORITHMS:
            self.cb_rule_algorithm.addItem(a, a)
        self.lbl_rule_algorithm = QLabel("算法:")
        add_form.addRow(self.lbl_rule_algorithm, self.cb_rule_algorithm)

        self._rule_params = {}
        self.rule_params_widget = QWidget()
        rule_params_row = QHBoxLayout(self.rule_params_widget)
        rule_params_row.setContentsMargins(0, 0, 0, 0)
        self.lbl_rule_params_summary = QLabel("未配置")
        self.lbl_rule_params_summary.setStyleSheet("color: #a6adc8;")
        btn_rule_params = QPushButton("配置参数")
        btn_rule_params.clicked.connect(self._open_rule_params_dialog)
        rule_params_row.addWidget(self.lbl_rule_params_summary, 1)
        rule_params_row.addWidget(btn_rule_params)
        self.lbl_rule_params = QLabel("算法参数:")
        add_form.addRow(self.lbl_rule_params, self.rule_params_widget)

        self.hash_group = QGroupBox("哈希前处理（可选）")
        hf = QFormLayout(self.hash_group)
        hf.setSpacing(6)

        self.cb_hash_enable = QComboBox()
        self.cb_hash_enable.addItem("不启用", "off")
        self.cb_hash_enable.addItem("启用", "on")
        self.cb_hash_enable.currentIndexChanged.connect(self._on_hash_enable_changed)
        hf.addRow("哈希前处理:", self.cb_hash_enable)

        self.cb_hash_algorithm = QComboBox()
        for h in ["MD5", "SHA1", "SHA256", "SHA512", "SM3", "HMAC"]:
            self.cb_hash_algorithm.addItem(h, h.lower())
        self.lbl_hash_algorithm = QLabel("哈希算法:")
        hf.addRow(self.lbl_hash_algorithm, self.cb_hash_algorithm)

        self.input_hash_hmac_key = QLineEdit()
        self.input_hash_hmac_key.setPlaceholderText("HMAC 密钥（仅 HMAC 时需要）")
        self.lbl_hash_hmac_key = QLabel("HMAC密钥:")
        hf.addRow(self.lbl_hash_hmac_key, self.input_hash_hmac_key)

        self.cb_hash_output_mode = QComboBox()
        self.cb_hash_output_mode.addItem("拼接到原值后面", "append")
        self.cb_hash_output_mode.addItem("拼接到原值前面", "prepend")
        self.cb_hash_output_mode.addItem("写入指定参数", "to_param")
        self.cb_hash_output_mode.currentIndexChanged.connect(self._on_hash_output_mode_changed)
        self.lbl_hash_output_mode = QLabel("输出模式:")
        hf.addRow(self.lbl_hash_output_mode, self.cb_hash_output_mode)

        self.input_hash_separator = QLineEdit()
        self.input_hash_separator.setPlaceholderText("如 | 或 &sign= 等")
        self.lbl_hash_separator = QLabel("拼接符:")
        hf.addRow(self.lbl_hash_separator, self.input_hash_separator)

        self.input_hash_target_param = QLineEdit()
        self.input_hash_target_param.setPlaceholderText("目标参数名，如 sign")
        self.lbl_hash_target_param = QLabel("目标参数:")
        hf.addRow(self.lbl_hash_target_param, self.input_hash_target_param)

        self._on_hash_enable_changed()

        layout.addLayout(add_form)
        layout.addWidget(self.hash_group)

        self.chain_group = QGroupBox("链式处理配置")
        chain_layout = QVBoxLayout(self.chain_group)
        self._chain_steps = []
        chain_row = QHBoxLayout()
        self.lbl_chain_summary = QLabel("未配置步骤")
        self.lbl_chain_summary.setStyleSheet("color: #a6adc8;")
        btn_chain_config = QPushButton("配置处理链")
        btn_chain_config.clicked.connect(self._open_chain_dialog)
        chain_row.addWidget(self.lbl_chain_summary, 1)
        chain_row.addWidget(btn_chain_config)
        chain_layout.addLayout(chain_row)
        layout.addWidget(self.chain_group)

        self.json_group = QGroupBox("JSON 字段链式加解密配置")
        jf = QFormLayout(self.json_group)
        jf.setSpacing(6)

        self.cb_json_action = QComboBox()
        if self._gw_type == "encrypt":
            self.cb_json_action.addItem("加密", "encrypt")
        elif self._gw_type == "decrypt":
            self.cb_json_action.addItem("解密", "decrypt")
        else:
            self.cb_json_action.addItem("解密", "decrypt")
            self.cb_json_action.addItem("加密", "encrypt")
        jf.addRow("执行操作:", self.cb_json_action)

        self.input_json_path = QLineEdit()
        self.input_json_path.setPlaceholderText("如 data 或 result.content")
        jf.addRow("数据字段路径:", self.input_json_path)

        CRYPTO_ALGORITHMS = ["SM4", "AES", "DES", "3DES", "RC4", "SM2", "RSA"]
        self.cb_data_algorithm = QComboBox()
        for a in CRYPTO_ALGORITHMS:
            self.cb_data_algorithm.addItem(a, a)
        jf.addRow("数据算法:", self.cb_data_algorithm)

        self._data_params = {}
        data_params_row = QHBoxLayout()
        self.lbl_data_params_summary = QLabel("未配置")
        self.lbl_data_params_summary.setStyleSheet("color: #a6adc8;")
        btn_data_params = QPushButton("配置参数")
        btn_data_params.clicked.connect(self._open_data_params_dialog)
        data_params_row.addWidget(self.lbl_data_params_summary, 1)
        data_params_row.addWidget(btn_data_params)
        jf.addRow("数据算法参数:", data_params_row)

        self.input_key_from_field = QLineEdit()
        self.input_key_from_field.setPlaceholderText("如 encKey（留空则不启用链式解密）")
        jf.addRow("密钥字段路径:", self.input_key_from_field)

        KEY_ALGORITHMS = ["SM2", "RSA"]
        self.cb_key_algorithm = QComboBox()
        for a in KEY_ALGORITHMS:
            self.cb_key_algorithm.addItem(a, a)
        jf.addRow("密钥解密算法:", self.cb_key_algorithm)

        self._key_params = {}
        key_params_row = QHBoxLayout()
        self.lbl_key_params_summary = QLabel("未配置")
        self.lbl_key_params_summary.setStyleSheet("color: #a6adc8;")
        btn_key_params = QPushButton("配置参数")
        btn_key_params.clicked.connect(self._open_key_params_dialog)
        key_params_row.addWidget(self.lbl_key_params_summary, 1)
        key_params_row.addWidget(btn_key_params)
        jf.addRow("密钥算法参数:", key_params_row)

        layout.addWidget(self.json_group)

        btn_add = QPushButton("添加规则")
        btn_add.setStyleSheet(
            "QPushButton { background-color: #89b4fa; color: #1e1e2e; font-weight: bold; }"
            "QPushButton:hover { background-color: #74c7ec; }")
        btn_add.clicked.connect(self._add_rule)
        layout.addWidget(btn_add)

        self._on_target_changed()
        self._on_wrapper_changed()
        self._on_match_mode_changed()

        self.rule_table = QTableWidget(0, 8)
        self.rule_table.setHorizontalHeaderLabels(
            ["匹配位置", "Header", "参数名", "匹配方式", "关键字", "操作", "算法", "包裹符"])
        self.rule_table.horizontalHeader().setSectionResizeMode(4, QHeaderView.Stretch)
        self.rule_table.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.rule_table.setEditTriggers(QAbstractItemView.NoEditTriggers)
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

    def _on_target_changed(self):
        target = self.cb_target.currentData()
        is_header = target == "request_header"
        is_param = target == "query_param"
        is_query_all = target == "query_param_all"
        is_json = target == "response_json_field"
        is_chain = target == "chain"

        self.input_header_name.setVisible(is_header)
        self.lbl_header_name.setVisible(is_header)
        self.input_param_name.setVisible(is_param)
        self.lbl_param_name.setVisible(is_param)

        self.json_group.setVisible(is_json)
        self.chain_group.setVisible(is_chain)

        show_normal = not is_json and not is_chain
        self.cb_match_mode.setVisible(show_normal and not is_query_all)
        self.lbl_match_mode.setVisible(show_normal and not is_query_all)
        self.cb_wrapper.setVisible(show_normal)
        self.lbl_wrapper.setVisible(show_normal)
        self.cb_action.setVisible(show_normal)
        self.lbl_action.setVisible(show_normal)
        self.cb_rule_algorithm.setVisible(show_normal)
        self.lbl_rule_algorithm.setVisible(show_normal)
        self.lbl_rule_params.setVisible(show_normal)
        self.rule_params_widget.setVisible(show_normal)
        self.hash_group.setVisible(show_normal)

        if is_chain:
            self.cb_match_mode.setVisible(True)
            self.lbl_match_mode.setVisible(True)
            self.input_keyword.setVisible(True)
            self.lbl_keyword.setVisible(True)
            self.input_wrapper_prefix.setVisible(False)
            self.lbl_wrapper_prefix.setVisible(False)
            self.input_wrapper_suffix.setVisible(False)
            self.lbl_wrapper_suffix.setVisible(False)
        elif is_json:
            self.input_keyword.setVisible(False)
            self.lbl_keyword.setVisible(False)
            self.input_wrapper_prefix.setVisible(False)
            self.lbl_wrapper_prefix.setVisible(False)
            self.input_wrapper_suffix.setVisible(False)
            self.lbl_wrapper_suffix.setVisible(False)
        elif is_query_all:
            self.cb_match_mode.setCurrentIndex(
                self.cb_match_mode.findData("all"))
            self.input_keyword.setVisible(False)
            self.lbl_keyword.setVisible(False)
            self._on_wrapper_changed()
        else:
            self._on_match_mode_changed()
            self._on_wrapper_changed()

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

    def _open_rule_params_dialog(self):
        algo = self.cb_rule_algorithm.currentData()
        dlg = AlgoParamsDialog(algo, self._rule_params, self)
        if dlg.exec_() == QDialog.Accepted:
            self._rule_params = dlg.get_params()
            self._update_params_summary(self.lbl_rule_params_summary, self._rule_params)

    def _open_chain_dialog(self):
        from gui.chain_dialog import ChainStepsDialog
        dlg = ChainStepsDialog(self._chain_steps, self)
        if dlg.exec_() == QDialog.Accepted:
            self._chain_steps = dlg.get_steps()
            n = len(self._chain_steps)
            if n:
                self.lbl_chain_summary.setText(f"已配置 {n} 个步骤")
                self.lbl_chain_summary.setStyleSheet("color: #a6e3a1;")
            else:
                self.lbl_chain_summary.setText("未配置步骤")
                self.lbl_chain_summary.setStyleSheet("color: #a6adc8;")

    def _on_hash_enable_changed(self):
        enabled = self.cb_hash_enable.currentData() == "on"
        self.cb_hash_algorithm.setVisible(enabled)
        self.lbl_hash_algorithm.setVisible(enabled)
        self.cb_hash_output_mode.setVisible(enabled)
        self.lbl_hash_output_mode.setVisible(enabled)
        self.input_hash_separator.setVisible(enabled)
        self.lbl_hash_separator.setVisible(enabled)
        self.input_hash_hmac_key.setVisible(enabled)
        self.lbl_hash_hmac_key.setVisible(enabled)
        self.input_hash_target_param.setVisible(False)
        self.lbl_hash_target_param.setVisible(False)
        if enabled:
            self._on_hash_output_mode_changed()

    def _on_hash_output_mode_changed(self):
        mode = self.cb_hash_output_mode.currentData()
        is_to_param = mode == "to_param"
        is_concat = mode in ("append", "prepend")
        self.input_hash_target_param.setVisible(is_to_param)
        self.lbl_hash_target_param.setVisible(is_to_param)
        self.input_hash_separator.setVisible(is_concat)
        self.lbl_hash_separator.setVisible(is_concat)

    def _collect_hash_config(self) -> dict:
        if self.cb_hash_enable.currentData() != "on":
            return {}
        cfg = {
            "enabled": True,
            "hash_algorithm": self.cb_hash_algorithm.currentData(),
            "output_mode": self.cb_hash_output_mode.currentData(),
            "separator": self.input_hash_separator.text(),
            "target_param": self.input_hash_target_param.text().strip(),
            "hmac_key": self.input_hash_hmac_key.text().strip(),
        }
        return cfg

    def _open_data_params_dialog(self):
        algo = self.cb_data_algorithm.currentData()
        dlg = AlgoParamsDialog(algo, self._data_params, self)
        if dlg.exec_() == QDialog.Accepted:
            self._data_params = dlg.get_params()
            self._update_params_summary(self.lbl_data_params_summary, self._data_params)

    def _open_key_params_dialog(self):
        algo = self.cb_key_algorithm.currentData()
        dlg = AlgoParamsDialog(algo, self._key_params, self)
        if dlg.exec_() == QDialog.Accepted:
            self._key_params = dlg.get_params()
            self._update_params_summary(self.lbl_key_params_summary, self._key_params)

    def _update_params_summary(self, label: QLabel, params: dict):
        if not params:
            label.setText("未配置")
            label.setStyleSheet("color: #a6adc8;")
            return
        parts = []
        for k, v in params.items():
            sv = str(v)
            if len(sv) > 16:
                sv = sv[:16] + "..."
            parts.append(f"{k}={sv}")
        label.setText(", ".join(parts))
        label.setStyleSheet("color: #a6e3a1;")

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

        if target == "response_json_field":
            return self._add_json_field_rule()

        if target == "chain":
            return self._add_chain_rule()

        match_mode = self.cb_match_mode.currentData()
        keyword = self.input_keyword.text().strip()
        header_name = self.input_header_name.text().strip()
        param_name = self.input_param_name.text().strip()
        if match_mode != "all" and not keyword:
            return
        if target == "request_header" and not header_name:
            return
        if target == "query_param" and not param_name:
            return
        wrapper = self._get_wrapper_config()
        rule = {
            "target": target,
            "header_name": header_name if target == "request_header" else "",
            "param_name": param_name if target == "query_param" else "",
            "match_mode": match_mode,
            "keyword": keyword,
            "action": self.cb_action.currentData(),
            "wrapper_prefix": wrapper["prefix"],
            "wrapper_suffix": wrapper["suffix"],
            "algorithm": self.cb_rule_algorithm.currentData(),
            "algorithm_params": dict(self._rule_params),
            "hash_config": self._collect_hash_config(),
        }
        self._append_table_row(rule)
        self.input_keyword.clear()
        self.input_header_name.clear()
        self.input_param_name.clear()
        self._rule_params = {}
        self._update_params_summary(self.lbl_rule_params_summary, {})
        self.cb_hash_enable.setCurrentIndex(0)
        self._on_hash_enable_changed()

    def _add_json_field_rule(self):
        json_path = self.input_json_path.text().strip()
        if not json_path:
            return
        data_algorithm = self.cb_data_algorithm.currentData()
        data_params = dict(self._data_params)

        key_from_field = self.input_key_from_field.text().strip()
        key_algorithm = self.cb_key_algorithm.currentData()
        key_params = dict(self._key_params)

        action = self.cb_json_action.currentData()

        rule = {
            "target": "response_json_field",
            "json_path": json_path,
            "match_mode": "all",
            "keyword": "",
            "header_name": "",
            "param_name": "",
            "action": action,
            "wrapper_prefix": "",
            "wrapper_suffix": "",
            "data_algorithm": data_algorithm,
            "data_params": data_params,
            "key_from_field": key_from_field,
            "key_algorithm": key_algorithm if key_from_field else "",
            "key_params": key_params if key_from_field else {},
        }
        self._append_table_row(rule)
        self.input_json_path.clear()
        self.input_key_from_field.clear()
        self._data_params = {}
        self._key_params = {}
        self._update_params_summary(self.lbl_data_params_summary, {})
        self._update_params_summary(self.lbl_key_params_summary, {})

    def _add_chain_rule(self):
        if not self._chain_steps:
            return
        match_mode = self.cb_match_mode.currentData()
        keyword = self.input_keyword.text().strip()
        if match_mode != "all" and not keyword:
            return
        rule = {
            "target": "chain",
            "header_name": "",
            "param_name": "",
            "match_mode": match_mode,
            "keyword": keyword,
            "action": "chain",
            "wrapper_prefix": "",
            "wrapper_suffix": "",
            "algorithm": "",
            "algorithm_params": {},
            "hash_config": {},
            "chain_steps": list(self._chain_steps),
        }
        self._append_table_row(rule)
        self.input_keyword.clear()
        self._chain_steps = []
        self.lbl_chain_summary.setText("未配置步骤")
        self.lbl_chain_summary.setStyleSheet("color: #a6adc8;")

    def _append_table_row(self, rule: dict):
        row = self.rule_table.rowCount()
        self.rule_table.insertRow(row)
        t_item = QTableWidgetItem(TARGET_MAP.get(rule["target"], rule["target"]))
        t_item.setData(Qt.UserRole, rule["target"])
        self.rule_table.setItem(row, 0, t_item)
        self.rule_table.setItem(row, 1, QTableWidgetItem(rule.get("header_name", "")))
        self.rule_table.setItem(row, 2, QTableWidgetItem(rule.get("param_name", "")))
        m_item = QTableWidgetItem(MODE_MAP.get(rule["match_mode"], rule["match_mode"]))
        m_item.setData(Qt.UserRole, rule["match_mode"])
        self.rule_table.setItem(row, 3, m_item)

        if rule["target"] == "response_json_field":
            kf = rule.get("key_from_field", "")
            disp_kw = rule.get("json_path", "")
            if kf:
                disp_kw += f" (密钥:{kf})"
            kw_item = QTableWidgetItem(disp_kw)
            kw_item.setData(Qt.UserRole, json.dumps({
                "json_path": rule.get("json_path", ""),
                "data_algorithm": rule.get("data_algorithm", ""),
                "data_params": rule.get("data_params", {}),
                "key_from_field": kf,
                "key_algorithm": rule.get("key_algorithm", ""),
                "key_params": rule.get("key_params", {}),
            }, ensure_ascii=False))
        elif rule["target"] == "chain":
            steps = rule.get("chain_steps", [])
            disp_kw = f"{len(steps)}步"
            kw_item = QTableWidgetItem(disp_kw)
            kw_item.setData(Qt.UserRole, json.dumps({
                "chain_steps": steps,
            }, ensure_ascii=False))
        else:
            kw_item = QTableWidgetItem(rule.get("keyword", ""))
        self.rule_table.setItem(row, 4, kw_item)

        a_item = QTableWidgetItem(ACTION_MAP.get(rule["action"], rule["action"]))
        a_item.setData(Qt.UserRole, rule["action"])
        self.rule_table.setItem(row, 5, a_item)

        algo = rule.get("algorithm", "")
        algo_params = rule.get("algorithm_params", {})
        hash_config = rule.get("hash_config", {})
        if rule["target"] == "response_json_field":
            algo_disp = rule.get("data_algorithm", "")
        elif rule["target"] == "chain":
            steps = rule.get("chain_steps", [])
            algos = [s.get("algorithm", "") for s in steps if s.get("algorithm")]
            algo_disp = "→".join(algos) if algos else "链式"
        else:
            algo_disp = algo
            if hash_config.get("enabled"):
                algo_disp += f"+{hash_config.get('hash_algorithm', '').upper()}"
        algo_item = QTableWidgetItem(algo_disp)
        algo_item.setData(Qt.UserRole, json.dumps({
            "algorithm": algo,
            "algorithm_params": algo_params,
            "hash_config": hash_config,
        }, ensure_ascii=False))
        self.rule_table.setItem(row, 6, algo_item)

        p = rule.get("wrapper_prefix", "")
        s = rule.get("wrapper_suffix", "")
        disp = "无" if not p and not s else f"{p}...{s}"
        w_item = QTableWidgetItem(disp)
        w_item.setData(Qt.UserRole, f"{p}|{s}")
        self.rule_table.setItem(row, 7, w_item)

    def _remove_rule(self):
        rows = sorted(set(idx.row() for idx in self.rule_table.selectedIndexes()), reverse=True)
        for row in rows:
            self.rule_table.removeRow(row)

    def _clear_rules(self):
        self.rule_table.setRowCount(0)

    def _load_rules(self, rules: list):
        for rule in rules:
            self._append_table_row(rule)

    def _collect_rules(self) -> list:
        rules = []
        for row in range(self.rule_table.rowCount()):
            target = self.rule_table.item(row, 0).data(Qt.UserRole)
            wrapper_data = self.rule_table.item(row, 7).data(Qt.UserRole) or "|"
            parts = wrapper_data.split("|", 1)

            algo_data = self.rule_table.item(row, 6).data(Qt.UserRole) or "{}"
            algo_info = json.loads(algo_data)

            rule = {
                "target": target,
                "header_name": self.rule_table.item(row, 1).text(),
                "param_name": self.rule_table.item(row, 2).text(),
                "match_mode": self.rule_table.item(row, 3).data(Qt.UserRole),
                "keyword": self.rule_table.item(row, 4).text() if target != "response_json_field" else "",
                "action": self.rule_table.item(row, 5).data(Qt.UserRole),
                "wrapper_prefix": parts[0] if len(parts) > 0 else "",
                "wrapper_suffix": parts[1] if len(parts) > 1 else "",
                "algorithm": algo_info.get("algorithm", ""),
                "algorithm_params": algo_info.get("algorithm_params", {}),
                "hash_config": algo_info.get("hash_config", {}),
            }

            if target == "response_json_field":
                extra_data = self.rule_table.item(row, 4).data(Qt.UserRole)
                if extra_data:
                    extra = json.loads(extra_data)
                    rule.update(extra)
            elif target == "chain":
                extra_data = self.rule_table.item(row, 4).data(Qt.UserRole)
                if extra_data:
                    extra = json.loads(extra_data)
                    rule["chain_steps"] = extra.get("chain_steps", [])

            rules.append(rule)
        return rules

    def _on_ok(self):
        self._result_rules = self._collect_rules()
        self.accept()

    def get_rules(self) -> list:
        return self._result_rules
