"""数据匹配规则面板 - 配置哪些数据需要加解密"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QGroupBox, QFormLayout,
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

ACTIONS = [
    ("encrypt", "加密"),
    ("decrypt", "解密"),
]

WRAPPERS = [
    ("none", "无"),
    ("double_quote", '双引号 "..."'),
    ("single_quote", "单引号 '...'"),
    ("custom", "自定义"),
]


class MatchPanel(QWidget):
    def __init__(self, config):
        super().__init__()
        self.config = config
        self._init_ui()
        self._load_rules()

    def _init_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(8)

        hint = QLabel(
            "配置匹配规则：当请求/响应中的指定位置命中关键字时，"
            "对该数据执行加密或解密操作。\n"
            "包裹符：解密时自动剥离，加密后自动包回，Burp 中看到纯明文。"
        )
        hint.setWordWrap(True)
        hint.setStyleSheet("color: #666; font-size: 9pt;")
        layout.addWidget(hint)

        add_group = QGroupBox("添加规则")
        add_layout = QFormLayout(add_group)

        self.cb_target = QComboBox()
        for val, label in TARGETS:
            self.cb_target.addItem(label, val)
        add_layout.addRow("匹配位置:", self.cb_target)
        self.cb_target.currentIndexChanged.connect(self._on_target_changed)

        self.input_header_name = QLineEdit()
        self.input_header_name.setPlaceholderText("如 Content-Type")
        self.lbl_header_name = QLabel("Header 名称:")
        add_layout.addRow(self.lbl_header_name, self.input_header_name)

        self.cb_match_mode = QComboBox()
        for val, label in MATCH_MODES:
            self.cb_match_mode.addItem(label, val)
        add_layout.addRow("匹配方式:", self.cb_match_mode)
        self.cb_match_mode.currentIndexChanged.connect(self._on_match_mode_changed)

        self.input_keyword = QLineEdit()
        self.input_keyword.setPlaceholderText("匹配关键字或正则表达式")
        self.lbl_keyword = QLabel("关键字:")
        add_layout.addRow(self.lbl_keyword, self.input_keyword)

        self.cb_action = QComboBox()
        for val, label in ACTIONS:
            self.cb_action.addItem(label, val)
        add_layout.addRow("执行操作:", self.cb_action)

        self.cb_wrapper = QComboBox()
        for val, label in WRAPPERS:
            self.cb_wrapper.addItem(label, val)
        add_layout.addRow("包裹符:", self.cb_wrapper)
        self.cb_wrapper.currentIndexChanged.connect(self._on_wrapper_changed)

        self.input_wrapper_prefix = QLineEdit()
        self.input_wrapper_prefix.setPlaceholderText("前缀，如 {\"data\":\"")
        self.lbl_wrapper_prefix = QLabel("自定义前缀:")
        add_layout.addRow(self.lbl_wrapper_prefix, self.input_wrapper_prefix)

        self.input_wrapper_suffix = QLineEdit()
        self.input_wrapper_suffix.setPlaceholderText("后缀，如 \"}")
        self.lbl_wrapper_suffix = QLabel("自定义后缀:")
        add_layout.addRow(self.lbl_wrapper_suffix, self.input_wrapper_suffix)

        btn_layout = QHBoxLayout()
        self.btn_add = QPushButton("添加规则")
        self.btn_add.clicked.connect(self._add_rule)
        btn_layout.addStretch()
        btn_layout.addWidget(self.btn_add)
        add_layout.addRow(btn_layout)

        layout.addWidget(add_group)

        self._on_target_changed()
        self._on_wrapper_changed()
        self._on_match_mode_changed()

        rules_group = QGroupBox("已配置规则")
        rules_layout = QVBoxLayout(rules_group)

        self.table = QTableWidget(0, 6)
        self.table.setHorizontalHeaderLabels(
            ["匹配位置", "Header名称", "匹配方式", "关键字", "操作", "包裹符"]
        )
        self.table.horizontalHeader().setSectionResizeMode(3, QHeaderView.Stretch)
        self.table.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.table.setEditTriggers(QAbstractItemView.NoEditTriggers)
        rules_layout.addWidget(self.table)

        tbl_btn_layout = QHBoxLayout()
        self.btn_remove = QPushButton("删除选中")
        self.btn_remove.clicked.connect(self._remove_selected)
        self.btn_clear_all = QPushButton("清空全部")
        self.btn_clear_all.clicked.connect(self._clear_all)
        tbl_btn_layout.addStretch()
        tbl_btn_layout.addWidget(self.btn_remove)
        tbl_btn_layout.addWidget(self.btn_clear_all)
        rules_layout.addLayout(tbl_btn_layout)

        layout.addWidget(rules_group)

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

    def _wrapper_display(self, rule: dict) -> str:
        p = rule.get("wrapper_prefix", "")
        s = rule.get("wrapper_suffix", "")
        if not p and not s:
            return "无"
        if p == '"' and s == '"':
            return '双引号'
        if p == "'" and s == "'":
            return '单引号'
        return f"{p}...{s}"

    def _target_label(self, val):
        return dict(TARGETS).get(val, val)

    def _match_label(self, val):
        return dict(MATCH_MODES).get(val, val)

    def _action_label(self, val):
        return dict(ACTIONS).get(val, val)

    def _add_rule(self):
        target = self.cb_target.currentData()
        header_name = self.input_header_name.text().strip()
        match_mode = self.cb_match_mode.currentData()
        keyword = self.input_keyword.text().strip()
        action = self.cb_action.currentData()
        wrapper = self._get_wrapper_config()

        if match_mode != "all" and not keyword:
            return
        if target == "request_header" and not header_name:
            return

        rule = {
            "target": target,
            "header_name": header_name if target == "request_header" else "",
            "match_mode": match_mode,
            "keyword": keyword,
            "action": action,
            "wrapper_prefix": wrapper["prefix"],
            "wrapper_suffix": wrapper["suffix"],
        }

        self._append_table_row(rule)
        self._save_rules()
        self.input_keyword.clear()
        self.input_header_name.clear()

    def _append_table_row(self, rule: dict):
        row = self.table.rowCount()
        self.table.insertRow(row)

        target_item = QTableWidgetItem(self._target_label(rule["target"]))
        target_item.setData(Qt.UserRole, rule["target"])
        self.table.setItem(row, 0, target_item)

        self.table.setItem(row, 1, QTableWidgetItem(rule.get("header_name", "")))

        mode_item = QTableWidgetItem(self._match_label(rule["match_mode"]))
        mode_item.setData(Qt.UserRole, rule["match_mode"])
        self.table.setItem(row, 2, mode_item)

        self.table.setItem(row, 3, QTableWidgetItem(rule["keyword"]))

        action_item = QTableWidgetItem(self._action_label(rule["action"]))
        action_item.setData(Qt.UserRole, rule["action"])
        self.table.setItem(row, 4, action_item)

        wrapper_item = QTableWidgetItem(self._wrapper_display(rule))
        wrapper_item.setData(Qt.UserRole, rule.get("wrapper_prefix", "") + "|" + rule.get("wrapper_suffix", ""))
        self.table.setItem(row, 5, wrapper_item)

    def _remove_selected(self):
        rows = sorted(set(idx.row() for idx in self.table.selectedIndexes()), reverse=True)
        for row in rows:
            self.table.removeRow(row)
        self._save_rules()

    def _clear_all(self):
        self.table.setRowCount(0)
        self._save_rules()

    def _save_rules(self):
        rules = []
        for row in range(self.table.rowCount()):
            wrapper_data = self.table.item(row, 5).data(Qt.UserRole) or "|"
            parts = wrapper_data.split("|", 1)
            rules.append({
                "target": self.table.item(row, 0).data(Qt.UserRole),
                "header_name": self.table.item(row, 1).text(),
                "match_mode": self.table.item(row, 2).data(Qt.UserRole),
                "keyword": self.table.item(row, 3).text(),
                "action": self.table.item(row, 4).data(Qt.UserRole),
                "wrapper_prefix": parts[0] if len(parts) > 0 else "",
                "wrapper_suffix": parts[1] if len(parts) > 1 else "",
            })
        self.config.set("match_rules", rules)

    def _load_rules(self):
        try:
            rules = self.config.get("match_rules")
        except (KeyError, TypeError):
            return
        for rule in rules:
            self._append_table_row(rule)
