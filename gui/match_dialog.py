"""数据匹配规则弹出窗口"""

from PyQt5.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QFormLayout,
    QComboBox, QLineEdit, QLabel, QPushButton,
    QTableWidget, QTableWidgetItem, QHeaderView, QAbstractItemView
)
from PyQt5.QtCore import Qt

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

TARGET_MAP = dict(TARGETS)
MODE_MAP = dict(MATCH_MODES)
ACTION_MAP = dict(ACTIONS)


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
        if self._gw_type == "encrypt":
            self.cb_action.addItem("加密", "encrypt")
        elif self._gw_type == "decrypt":
            self.cb_action.addItem("解密", "decrypt")
        else:
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
        btn_add.setStyleSheet(
            "QPushButton { background-color: #89b4fa; color: #1e1e2e; font-weight: bold; }"
            "QPushButton:hover { background-color: #74c7ec; }")
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
        self.input_keyword.clear()
        self.input_header_name.clear()

    def _append_table_row(self, rule: dict):
        row = self.rule_table.rowCount()
        self.rule_table.insertRow(row)
        t_item = QTableWidgetItem(TARGET_MAP.get(rule["target"], rule["target"]))
        t_item.setData(Qt.UserRole, rule["target"])
        self.rule_table.setItem(row, 0, t_item)
        self.rule_table.setItem(row, 1, QTableWidgetItem(rule.get("header_name", "")))
        m_item = QTableWidgetItem(MODE_MAP.get(rule["match_mode"], rule["match_mode"]))
        m_item.setData(Qt.UserRole, rule["match_mode"])
        self.rule_table.setItem(row, 2, m_item)
        self.rule_table.setItem(row, 3, QTableWidgetItem(rule["keyword"]))
        a_item = QTableWidgetItem(ACTION_MAP.get(rule["action"], rule["action"]))
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

    def _clear_rules(self):
        self.rule_table.setRowCount(0)

    def _load_rules(self, rules: list):
        for rule in rules:
            self._append_table_row(rule)

    def _collect_rules(self) -> list:
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
        return rules

    def _on_ok(self):
        self._result_rules = self._collect_rules()
        self.accept()

    def get_rules(self) -> list:
        return self._result_rules
