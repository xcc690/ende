"""路径工具 - 兼容开发模式和 PyInstaller 打包（Windows/macOS）"""

import os
import sys


def get_project_root() -> str:
    """资源目录 - js_engine, addons, core 等只读资源"""
    if getattr(sys, 'frozen', False):
        return sys._MEIPASS if hasattr(sys, '_MEIPASS') else os.path.dirname(sys.executable)
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def get_work_dir() -> str:
    """工作目录 - 运行时配置文件等可写文件"""
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
