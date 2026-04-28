"""主窗口 - 动态网关标签页管理"""

from PyQt5.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QTabWidget, QInputDialog, QMessageBox,
    QToolButton, QFileDialog
)
from PyQt5.QtCore import Qt
from gui.gateway_tab import GatewayTab
from gui.log_panel import LogPanel
from core.config_center import ConfigCenter
from core.gateway_manager import GatewayManager


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("加解密链式代理工具")
        self.setMinimumSize(900, 700)

        self.config = ConfigCenter.instance()
        self.gateway_mgr = GatewayManager(self.config)
        self.gateway_mgr.log_output.connect(self._on_gateway_log)
        self.gateway_mgr.status_changed.connect(self._on_gateway_status)

        self._gw_tabs = {}
        self._init_ui()

    def _init_ui(self):
        central = QWidget()
        self.setCentralWidget(central)
        layout = QVBoxLayout(central)
        layout.setContentsMargins(6, 6, 6, 6)

        self.tabs = QTabWidget()
        self.tabs.setTabsClosable(False)

        self.log_panel = LogPanel()
        self.tabs.addTab(self.log_panel, "日志")

        corner = QWidget()
        corner_layout = QHBoxLayout(corner)
        corner_layout.setContentsMargins(0, 0, 0, 0)
        corner_layout.setSpacing(4)

        btn_load = QToolButton()
        btn_load.setText("加载配置")
        btn_load.setToolTip("从 .runtime_xx.json 加载网关配置")
        btn_load.setStyleSheet("QToolButton { padding: 2px 6px; }")
        btn_load.clicked.connect(self._load_config_file)

        btn_add = QToolButton()
        btn_add.setText("+")
        btn_add.setToolTip("添加网关")
        btn_add.setStyleSheet("QToolButton { font-size: 14pt; font-weight: bold; padding: 2px 8px; }")
        btn_add.clicked.connect(self._add_gateway_dialog)

        corner_layout.addWidget(btn_load)
        corner_layout.addWidget(btn_add)
        self.tabs.setCornerWidget(corner, Qt.TopRightCorner)

        layout.addWidget(self.tabs)

    def _load_config_file(self):
        paths, _ = QFileDialog.getOpenFileNames(
            self, "加载网关配置", "",
            "JSON 配置文件 (*.json);;所有文件 (*)")
        if not paths:
            return
        for path in paths:
            try:
                data = ConfigCenter.load_gateway_from_file(path)
                if "gateways" in data:
                    for gw_data in data["gateways"]:
                        gw = self.config.import_gateway(gw_data)
                        self._create_tab(gw["name"])
                else:
                    gw = self.config.import_gateway(data)
                    self._create_tab(gw["name"])
                self.log_panel.append_log(f"已加载配置: {path}")
            except Exception as e:
                QMessageBox.warning(self, "加载失败", f"文件: {path}\n错误: {e}")

    def _add_gateway_dialog(self):
        name, ok = QInputDialog.getText(self, "添加网关", "网关名称:")
        if not ok or not name.strip():
            return
        name = name.strip()

        if name in self._gw_tabs:
            QMessageBox.warning(self, "重复", f"网关 '{name}' 已存在")
            return

        items = ["解密网关 (decrypt)", "加密网关 (encrypt)", "加解密网关 (both)"]
        choice, ok = QInputDialog.getItem(self, "网关类型", "选择类型:", items, 0, False)
        if not ok:
            return
        if "decrypt" in choice:
            gw_type = "decrypt"
        elif "encrypt" in choice:
            gw_type = "encrypt"
        else:
            gw_type = "both"

        existing = self.config.get_all_gateways()
        used_ports = {g["network"]["listen_port"] for g in existing}
        port = 8080
        while port in used_ports:
            port += 1

        self.config.add_gateway(name, gw_type, port)
        self._create_tab(name)

    def _create_tab(self, gw_name: str):
        tab = GatewayTab(self.config, gw_name, self.gateway_mgr)
        tab.log_signal.connect(self.log_panel.append_log)
        tab.request_remove.connect(self._remove_gateway)

        idx = self.tabs.count() - 1
        self.tabs.insertTab(idx, tab, gw_name)
        self._gw_tabs[gw_name] = tab
        self.tabs.setCurrentIndex(idx)

    def _remove_gateway(self, gw_name: str):
        reply = QMessageBox.question(
            self, "确认删除",
            f"确定删除网关 '{gw_name}'？\n运行中的网关将被停止。",
            QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
        if reply != QMessageBox.Yes:
            return

        if self.gateway_mgr.is_running(gw_name):
            self.gateway_mgr.stop_gateway(gw_name)

        tab = self._gw_tabs.pop(gw_name, None)
        if tab:
            tab.cleanup()
            idx = self.tabs.indexOf(tab)
            if idx >= 0:
                self.tabs.removeTab(idx)
            tab.deleteLater()

        self.config.remove_gateway(gw_name)

    def _on_gateway_log(self, gw_name: str, message: str):
        self.log_panel.append_log(message)

    def _on_gateway_status(self, gw_name: str, is_running: bool):
        tab = self._gw_tabs.get(gw_name)
        if tab:
            tab.on_status_changed(is_running)

    def closeEvent(self, event):
        for tab in self._gw_tabs.values():
            tab.cleanup()
        self.gateway_mgr.stop_all()
        super().closeEvent(event)
