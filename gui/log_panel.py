"""日志输出面板（独立标签页）- 高性能缓冲"""

from PyQt5.QtWidgets import QWidget, QVBoxLayout, QPlainTextEdit, QHBoxLayout, QPushButton
from PyQt5.QtCore import QTimer
from datetime import datetime

MAX_LINES = 500
FLUSH_INTERVAL_MS = 500
MAX_BUFFER = 50


class LogPanel(QWidget):
    def __init__(self):
        super().__init__()
        self._buffer = []
        self._drop_count = 0
        self._init_ui()

        self._flush_timer = QTimer(self)
        self._flush_timer.timeout.connect(self._flush)
        self._flush_timer.start(FLUSH_INTERVAL_MS)

    def _init_ui(self):
        layout = QVBoxLayout(self)

        btn_layout = QHBoxLayout()
        self.btn_clear = QPushButton("清空日志")
        self.btn_clear.clicked.connect(self._clear)
        btn_layout.addStretch()
        btn_layout.addWidget(self.btn_clear)
        layout.addLayout(btn_layout)

        self.log_text = QPlainTextEdit()
        self.log_text.setReadOnly(True)
        self.log_text.setMaximumBlockCount(MAX_LINES)
        self.log_text.setStyleSheet(
            "QPlainTextEdit { background-color: #1e1e1e; color: #d4d4d4; "
            "font-family: 'Consolas', 'Courier New', 'Microsoft YaHei UI'; font-size: 9pt; }"
        )
        layout.addWidget(self.log_text)

    def append_log(self, message: str):
        if len(self._buffer) >= MAX_BUFFER:
            self._drop_count += 1
            return
        timestamp = datetime.now().strftime("%H:%M:%S")
        self._buffer.append(f"[{timestamp}] {message}")

    def _flush(self):
        if not self._buffer:
            return

        if self._drop_count > 0:
            self._buffer.append(f"[...] 已省略 {self._drop_count} 条日志")
            self._drop_count = 0

        chunk = "\n".join(self._buffer)
        self._buffer.clear()
        self.log_text.appendPlainText(chunk)

        scrollbar = self.log_text.verticalScrollBar()
        scrollbar.setValue(scrollbar.maximum())

    def _clear(self):
        self._buffer.clear()
        self._drop_count = 0
        self.log_text.clear()
