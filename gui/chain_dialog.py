"""链式处理步骤配置对话框"""

import json
from PyQt5.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QFormLayout,
    QComboBox, QLineEdit, QLabel, QPushButton,
    QTableWidget, QTableWidgetItem, QHeaderView, QAbstractItemView
)
from PyQt5.QtCore import Qt
from gui.algo_params import ALGORITHMS, ALGO_PARAMS
from gui.match_dialog import AlgoParamsDialog

EXTRACT_MODES = [
    ("all", "全部（不提取）"),
    ("regex", "正则提取"),
    ("json_path", "JSON 路径"),
    ("key_value", "键值对 key=value"),
]

STEP_ACTIONS = [("decrypt", "解密"), ("encrypt", "加密")]


class ChainStepEditDialog(QDialog):
    """单步编辑对话框"""

    def __init__(self, step_data: dict = None, parent=None):
        super().__init__(parent)
        self.setWindowTitle("编辑处理步骤")
        self.setMinimumWidth(450)
        self._algo_params = dict((step_data or {}).get("algorithm_params", {}))
        self._init_ui(step_data or {})

    def _init_ui(self, data: dict):
        layout = QVBoxLayout(self)
        form = QFormLayout()
        form.setSpacing(8)

        self.cb_engine = QComboBox()
        self.cb_engine.addItem("本地 JS 引擎", "local")
        self.cb_engine.addItem("JSRPC 远程调用", "jsrpc")
        idx = self.cb_engine.findData(data.get("engine", "local"))
        if idx >= 0:
            self.cb_engine.setCurrentIndex(idx)
        self.cb_engine.currentIndexChanged.connect(self._on_engine_changed)
        form.addRow("执行引擎:", self.cb_engine)

        self.cb_extract = QComboBox()
        for val, label in EXTRACT_MODES:
            self.cb_extract.addItem(label, val)
        idx = self.cb_extract.findData(data.get("extract_mode", "all"))
        if idx >= 0:
            self.cb_extract.setCurrentIndex(idx)
        self.cb_extract.currentIndexChanged.connect(self._on_extract_changed)
        form.addRow("提取方式:", self.cb_extract)

        self.input_pattern = QLineEdit()
        self.input_pattern.setText(data.get("extract_pattern", ""))
        self.input_pattern.setPlaceholderText("正则/JSON路径/键名")
        self.lbl_pattern = QLabel("提取表达式:")
        form.addRow(self.lbl_pattern, self.input_pattern)

        self.cb_action = QComboBox()
        for val, label in STEP_ACTIONS:
            self.cb_action.addItem(label, val)
        idx = self.cb_action.findData(data.get("action", "decrypt"))
        if idx >= 0:
            self.cb_action.setCurrentIndex(idx)
        form.addRow("操作:", self.cb_action)

        self.cb_algorithm = QComboBox()
        for a in ALGORITHMS:
            self.cb_algorithm.addItem(a, a)
        idx = self.cb_algorithm.findData(data.get("algorithm", "SM4"))
        if idx >= 0:
            self.cb_algorithm.setCurrentIndex(idx)
        form.addRow("算法:", self.cb_algorithm)

        params_row = QHBoxLayout()
        self.lbl_params_summary = QLabel("未配置")
        self.lbl_params_summary.setStyleSheet("color: #a6adc8;")
        if self._algo_params:
            parts = [f"{k}={str(v)[:12]}" for k, v in self._algo_params.items()]
            self.lbl_params_summary.setText(", ".join(parts))
            self.lbl_params_summary.setStyleSheet("color: #a6e3a1;")
        btn_params = QPushButton("配置参数")
        btn_params.clicked.connect(self._open_params)
        params_row.addWidget(self.lbl_params_summary, 1)
        params_row.addWidget(btn_params)
        form.addRow("算法参数:", params_row)

        self.input_jsrpc_group = QLineEdit()
        self.input_jsrpc_group.setText(data.get("jsrpc_group", ""))
        self.input_jsrpc_group.setPlaceholderText("JSRPC group 名称")
        self.lbl_jsrpc_group = QLabel("JSRPC Group:")
        form.addRow(self.lbl_jsrpc_group, self.input_jsrpc_group)

        self.input_jsrpc_func = QLineEdit()
        self.input_jsrpc_func.setText(data.get("jsrpc_func", ""))
        self.input_jsrpc_func.setPlaceholderText("远程函数名，如 encrypt 或 F")
        self.lbl_jsrpc_func = QLabel("JSRPC 函数:")
        form.addRow(self.lbl_jsrpc_func, self.input_jsrpc_func)

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

        self._on_extract_changed()
        self._on_engine_changed()

    def _on_engine_changed(self):
        is_jsrpc = self.cb_engine.currentData() == "jsrpc"
        self.input_jsrpc_group.setVisible(is_jsrpc)
        self.lbl_jsrpc_group.setVisible(is_jsrpc)
        self.input_jsrpc_func.setVisible(is_jsrpc)
        self.lbl_jsrpc_func.setVisible(is_jsrpc)
        self.cb_algorithm.setVisible(not is_jsrpc)
        self.cb_action.setVisible(not is_jsrpc)

    def _on_extract_changed(self):
        mode = self.cb_extract.currentData()
        show = mode != "all"
        self.input_pattern.setVisible(show)
        self.lbl_pattern.setVisible(show)
        if mode == "regex":
            self.input_pattern.setPlaceholderText("正则表达式，用 () 捕获目标")
        elif mode == "json_path":
            self.input_pattern.setPlaceholderText("如 data 或 result.content")
        elif mode == "key_value":
            self.input_pattern.setPlaceholderText("键名，如 pdata")

    def _open_params(self):
        algo = self.cb_algorithm.currentData()
        dlg = AlgoParamsDialog(algo, self._algo_params, self)
        if dlg.exec_() == QDialog.Accepted:
            self._algo_params = dlg.get_params()
            if self._algo_params:
                parts = [f"{k}={str(v)[:12]}" for k, v in self._algo_params.items()]
                self.lbl_params_summary.setText(", ".join(parts))
                self.lbl_params_summary.setStyleSheet("color: #a6e3a1;")
            else:
                self.lbl_params_summary.setText("未配置")
                self.lbl_params_summary.setStyleSheet("color: #a6adc8;")

    def get_step(self) -> dict:
        return {
            "engine": self.cb_engine.currentData(),
            "extract_mode": self.cb_extract.currentData(),
            "extract_pattern": self.input_pattern.text().strip(),
            "action": self.cb_action.currentData(),
            "algorithm": self.cb_algorithm.currentData(),
            "algorithm_params": dict(self._algo_params),
            "jsrpc_group": self.input_jsrpc_group.text().strip(),
            "jsrpc_func": self.input_jsrpc_func.text().strip(),
        }


class ChainStepsDialog(QDialog):
    """链式处理步骤列表管理"""

    def __init__(self, steps: list = None, parent=None):
        super().__init__(parent)
        self.setWindowTitle("链式处理配置")
        self.setMinimumSize(650, 400)
        self._steps = list(steps or [])
        self._init_ui()
        self._refresh_table()

    def _init_ui(self):
        layout = QVBoxLayout(self)

        self.table = QTableWidget(0, 5)
        self.table.setHorizontalHeaderLabels(["序号", "提取方式", "表达式", "算法", "操作"])
        self.table.horizontalHeader().setSectionResizeMode(2, QHeaderView.Stretch)
        self.table.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.table.setEditTriggers(QAbstractItemView.NoEditTriggers)
        layout.addWidget(self.table)

        btn_row = QHBoxLayout()
        btn_add = QPushButton("添加步骤")
        btn_add.setStyleSheet(
            "QPushButton { background-color: #89b4fa; color: #1e1e2e; font-weight: bold; }"
            "QPushButton:hover { background-color: #74c7ec; }")
        btn_add.clicked.connect(self._add_step)
        btn_edit = QPushButton("编辑")
        btn_edit.clicked.connect(self._edit_step)
        btn_del = QPushButton("删除")
        btn_del.clicked.connect(self._del_step)
        btn_up = QPushButton("上移")
        btn_up.clicked.connect(self._move_up)
        btn_down = QPushButton("下移")
        btn_down.clicked.connect(self._move_down)
        btn_row.addWidget(btn_add)
        btn_row.addWidget(btn_edit)
        btn_row.addWidget(btn_del)
        btn_row.addStretch()
        btn_row.addWidget(btn_up)
        btn_row.addWidget(btn_down)
        layout.addLayout(btn_row)

        bottom = QHBoxLayout()
        bottom.addStretch()
        btn_ok = QPushButton("  确定  ")
        btn_ok.setStyleSheet(
            "QPushButton { background-color: #a6e3a1; color: #1e1e2e; font-weight: bold; }"
            "QPushButton:hover { background-color: #94e2d5; }")
        btn_cancel = QPushButton("  取消  ")
        btn_ok.clicked.connect(self.accept)
        btn_cancel.clicked.connect(self.reject)
        bottom.addWidget(btn_ok)
        bottom.addWidget(btn_cancel)
        layout.addLayout(bottom)

    def _refresh_table(self):
        self.table.setRowCount(0)
        extract_map = dict(EXTRACT_MODES)
        action_map = dict(STEP_ACTIONS)
        for i, step in enumerate(self._steps):
            row = self.table.rowCount()
            self.table.insertRow(row)
            self.table.setItem(row, 0, QTableWidgetItem(str(i + 1)))
            self.table.setItem(row, 1, QTableWidgetItem(
                extract_map.get(step.get("extract_mode", "all"), "全部")))
            self.table.setItem(row, 2, QTableWidgetItem(
                step.get("extract_pattern", "")))
            engine = step.get("engine", "local")
            if engine == "jsrpc":
                algo_disp = f"JSRPC:{step.get('jsrpc_func', '')}"
            else:
                algo_disp = step.get("algorithm", "")
            self.table.setItem(row, 3, QTableWidgetItem(algo_disp))
            self.table.setItem(row, 4, QTableWidgetItem(
                action_map.get(step.get("action", "decrypt"), "解密")))

    def _selected_row(self) -> int:
        rows = self.table.selectionModel().selectedRows()
        if rows:
            return rows[0].row()
        return -1

    def _add_step(self):
        dlg = ChainStepEditDialog(parent=self)
        if dlg.exec_() == QDialog.Accepted:
            self._steps.append(dlg.get_step())
            self._refresh_table()

    def _edit_step(self):
        row = self._selected_row()
        if row < 0:
            return
        dlg = ChainStepEditDialog(self._steps[row], parent=self)
        if dlg.exec_() == QDialog.Accepted:
            self._steps[row] = dlg.get_step()
            self._refresh_table()

    def _del_step(self):
        row = self._selected_row()
        if row >= 0:
            self._steps.pop(row)
            self._refresh_table()

    def _move_up(self):
        row = self._selected_row()
        if row > 0:
            self._steps[row - 1], self._steps[row] = self._steps[row], self._steps[row - 1]
            self._refresh_table()
            self.table.selectRow(row - 1)

    def _move_down(self):
        row = self._selected_row()
        if 0 <= row < len(self._steps) - 1:
            self._steps[row], self._steps[row + 1] = self._steps[row + 1], self._steps[row]
            self._refresh_table()
            self.table.selectRow(row + 1)

    def get_steps(self) -> list:
        return list(self._steps)
