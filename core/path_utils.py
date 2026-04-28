"""路径工具 - 兼容开发模式和 PyInstaller 打包（Windows/macOS）"""

import os
import sys


def get_project_root() -> str:
    if getattr(sys, 'frozen', False):
        if hasattr(sys, '_MEIPASS'):
            return sys._MEIPASS
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
