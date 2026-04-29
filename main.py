"""加解密链式代理工具 - 主入口"""

import sys
import os
from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import Qt, QCoreApplication, qInstallMessageHandler, QtInfoMsg, QtWarningMsg
from PyQt5.QtGui import QFont, QIcon, QPalette, QColor
from core.path_utils import get_project_root


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

    palette = QPalette()
    palette.setColor(QPalette.Window, QColor("#1e1e2e"))
    palette.setColor(QPalette.WindowText, QColor("#cdd6f4"))
    palette.setColor(QPalette.Base, QColor("#313244"))
    palette.setColor(QPalette.AlternateBase, QColor("#45475a"))
    palette.setColor(QPalette.Text, QColor("#cdd6f4"))
    palette.setColor(QPalette.Button, QColor("#45475a"))
    palette.setColor(QPalette.ButtonText, QColor("#cdd6f4"))
    palette.setColor(QPalette.BrightText, QColor("#f38ba8"))
    palette.setColor(QPalette.Highlight, QColor("#89b4fa"))
    palette.setColor(QPalette.HighlightedText, QColor("#1e1e2e"))
    palette.setColor(QPalette.ToolTipBase, QColor("#313244"))
    palette.setColor(QPalette.ToolTipText, QColor("#cdd6f4"))
    palette.setColor(QPalette.Link, QColor("#89b4fa"))
    palette.setColor(QPalette.Disabled, QPalette.WindowText, QColor("#585b70"))
    palette.setColor(QPalette.Disabled, QPalette.Text, QColor("#585b70"))
    palette.setColor(QPalette.Disabled, QPalette.ButtonText, QColor("#585b70"))
    app.setPalette(palette)

    icon_path = os.path.join(get_project_root(), "app_icon.ico")
    if os.path.exists(icon_path):
        app.setWindowIcon(QIcon(icon_path))

    from gui.theme import DARK_THEME
    app.setStyleSheet(DARK_THEME)

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
