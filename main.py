"""加解密链式代理工具 - 主入口"""

import sys
import os
from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import Qt, QCoreApplication, qInstallMessageHandler, QtInfoMsg, QtWarningMsg
from PyQt5.QtGui import QFont


def _qt_message_filter(msg_type, context, message):
    if msg_type in (QtInfoMsg, QtWarningMsg):
        if "DirectWrite" in message or "OpenType support missing" in message:
            return
    sys.__stderr__.write(message + "\n")


def main():
    QCoreApplication.setAttribute(Qt.AA_EnableHighDpiScaling, True)
    QCoreApplication.setAttribute(Qt.AA_UseHighDpiPixmaps, True)
    os.environ["QT_AUTO_SCREEN_SCALE_FACTOR"] = "1"
    qInstallMessageHandler(_qt_message_filter)

    app = QApplication(sys.argv)
    app.setStyle("Fusion")

    screen = app.primaryScreen()
    dpi = screen.logicalDotsPerInch()
    base_pt = max(9, min(14, int(dpi / 11)))

    font = QFont()
    font.setPointSize(base_pt)
    app.setFont(font)

    from gui.main_window import MainWindow
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
