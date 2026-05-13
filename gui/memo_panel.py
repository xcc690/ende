"""JSRPC 备忘录面板（独立标签页）"""

import json
import os
from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QDialog, QTextEdit, QDialogButtonBox, QApplication, QGroupBox
)
from PyQt5.QtCore import Qt

MEMO_FILE = os.path.join(
    os.path.expanduser("~"), ".ende_memo.json"
)

CATEGORIES = [
    ("inject", "注入代码", "粘贴 HlClient 注入代码"),
    ("connect", "连接代码", '如 var demo = new Hlclient("ws://127.0.0.1:12080/ws?group=zzz")'),
    ("register", "注册方法", 'demo.regAction("F", function(resolve, param){ ... })'),
]


class MemoPanel(QWidget):
    def __init__(self):
        super().__init__()
        self._data = self._load()
        self._labels = {}
        self._init_ui()
        self._refresh_all_labels()

    def _init_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(12)

        title = QLabel("JSRPC 备忘录")
        title.setStyleSheet("font-size: 14px; font-weight: bold; color: #cdd6f4;")
        layout.addWidget(title)

        for key, label, placeholder in CATEGORIES:
            group = QGroupBox(label)
            h = QHBoxLayout(group)
            h.setContentsMargins(8, 8, 8, 8)
            h.setSpacing(8)

            lbl = QLabel("未设置")
            lbl.setStyleSheet("color: #a6adc8;")
            lbl.setWordWrap(True)
            self._labels[key] = lbl
            h.addWidget(lbl, 1)

            btn_edit = QPushButton("编辑")
            btn_edit.setFixedWidth(60)
            btn_edit.clicked.connect(lambda _, k=key, l=label, p=placeholder: self._edit(k, l, p))
            h.addWidget(btn_edit)

            btn_copy = QPushButton("复制")
            btn_copy.setFixedWidth(60)
            btn_copy.clicked.connect(lambda _, k=key: self._copy(k))
            h.addWidget(btn_copy)

            layout.addWidget(group)

        layout.addStretch()

    def _edit(self, key: str, label: str, placeholder: str):
        dlg = QDialog(self)
        dlg.setWindowTitle(f"编辑 - {label}")
        dlg.resize(600, 350)
        lay = QVBoxLayout(dlg)

        editor = QTextEdit()
        editor.setPlaceholderText(placeholder)
        editor.setPlainText(self._data.get(key, ""))
        editor.setStyleSheet(
            "QTextEdit { background-color: #1e1e2e; color: #cdd6f4; "
            "font-family: 'Consolas', 'Courier New', 'Microsoft YaHei UI'; }"
        )
        lay.addWidget(editor)

        buttons = QDialogButtonBox(QDialogButtonBox.Save | QDialogButtonBox.Cancel)
        buttons.accepted.connect(dlg.accept)
        buttons.rejected.connect(dlg.reject)
        lay.addWidget(buttons)

        if dlg.exec_() == QDialog.Accepted:
            self._data[key] = editor.toPlainText()
            self._save()
            self._refresh_label(key)

    def _copy(self, key: str):
        text = self._data.get(key, "")
        if text:
            QApplication.clipboard().setText(text)

    def _refresh_label(self, key: str):
        lbl = self._labels.get(key)
        if not lbl:
            return
        text = self._data.get(key, "")
        if text:
            preview = text.replace("\n", " ")[:80]
            if len(text) > 80:
                preview += "..."
            lbl.setText(preview)
            lbl.setStyleSheet("color: #cdd6f4;")
        else:
            lbl.setText("未设置")
            lbl.setStyleSheet("color: #a6adc8;")

    def _refresh_all_labels(self):
        for key in self._labels:
            self._refresh_label(key)

    def _load(self) -> dict:
        if os.path.exists(MEMO_FILE):
            try:
                with open(MEMO_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except (json.JSONDecodeError, OSError):
                pass
        return {}

    def _save(self):
        try:
            with open(MEMO_FILE, "w", encoding="utf-8") as f:
                json.dump(self._data, f, ensure_ascii=False, indent=2)
        except OSError:
            pass
