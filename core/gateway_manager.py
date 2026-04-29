"""网关进程管理器 - 支持动态多网关"""

import os
import sys
import shutil
from PyQt5.QtCore import QObject, pyqtSignal, QProcess, QProcessEnvironment


class GatewayManager(QObject):
    log_output = pyqtSignal(str, str)
    status_changed = pyqtSignal(str, bool)

    def __init__(self, config_center):
        super().__init__()
        self.config = config_center
        self._processes = {}
        from core.path_utils import get_project_root, get_work_dir
        self._project_root = get_project_root()
        self._work_dir = get_work_dir()

    def _find_mitmdump(self) -> str:
        if getattr(sys, 'frozen', False):
            exe_dir = os.path.dirname(sys.executable)
            for candidate in [
                os.path.join(exe_dir, "mitmdump.exe"),
                os.path.join(exe_dir, "mitmdump", "mitmdump.exe"),
            ]:
                if os.path.exists(candidate):
                    return candidate
        return shutil.which("mitmdump") or "mitmdump"

    def _config_path(self, gw_name: str) -> str:
        return os.path.join(self._work_dir, f".runtime_{gw_name}.json")

    def start_gateway(self, gw_name: str) -> bool:
        if gw_name in self._processes:
            self.log_output.emit(gw_name, f"[{gw_name}] 已在运行中")
            return False

        config_file = self._config_path(gw_name)
        self.config.export_gateway_config(gw_name, config_file)

        gw = self.config.get_gateway(gw_name)
        port = gw["network"]["listen_port"]
        upstream = gw["network"].get("upstream_proxy", "")
        gw_type = gw["type"]

        if gw_type == "decrypt":
            addon_path = os.path.join(self._project_root, "addons", "decrypt_addon.py")
        elif gw_type == "encrypt":
            addon_path = os.path.join(self._project_root, "addons", "encrypt_addon.py")
        else:
            addon_path = os.path.join(self._project_root, "addons", "crypto_addon.py")

        cmd = [
            self._find_mitmdump(),
            "--listen-port", str(port),
            "--ssl-insecure",
            "-s", addon_path,
        ]
        if upstream:
            cmd.extend(["--mode", f"upstream:{upstream}"])

        process = QProcess(self)
        process.setProcessChannelMode(QProcess.MergedChannels)

        name = gw_name
        process.readyReadStandardOutput.connect(
            lambda n=name, p=process: self._on_output(n, p)
        )
        process.finished.connect(
            lambda code, status, n=name: self._on_finished(n, code)
        )

        env = QProcessEnvironment.systemEnvironment()
        env.insert("PYTHONPATH", self._project_root)
        env.insert("ENDE_CONFIG_FILE", config_file)
        process.setProcessEnvironment(env)

        self.log_output.emit(gw_name, f"[{gw_name}] 启动: {' '.join(cmd)}")
        process.start(cmd[0], cmd[1:])

        if not process.waitForStarted(5000):
            self.log_output.emit(gw_name, f"[{gw_name}] 启动失败")
            return False

        self._processes[gw_name] = process
        self.status_changed.emit(gw_name, True)
        self.log_output.emit(gw_name, f"[{gw_name}] 已启动，监听端口 {port}")
        return True

    def stop_gateway(self, gw_name: str) -> bool:
        process = self._processes.pop(gw_name, None)
        if process is None:
            return False

        self.log_output.emit(gw_name, f"[{gw_name}] 正在停止...")
        process.kill()
        process.waitForFinished(2000)

        self.status_changed.emit(gw_name, False)
        self.log_output.emit(gw_name, f"[{gw_name}] 已停止")
        return True

    def is_running(self, gw_name: str) -> bool:
        p = self._processes.get(gw_name)
        return p is not None and p.state() == QProcess.Running

    def stop_all(self):
        for name in list(self._processes.keys()):
            self.stop_gateway(name)

    def _on_output(self, gw_name: str, process: QProcess):
        data = process.readAllStandardOutput().data().decode("utf-8", errors="replace")
        for line in data.strip().splitlines():
            self.log_output.emit(gw_name, f"[{gw_name}] {line}")

    def _on_finished(self, gw_name: str, exit_code: int):
        self._processes.pop(gw_name, None)
        self.status_changed.emit(gw_name, False)
        self.log_output.emit(gw_name, f"[{gw_name}] 进程退出，代码: {exit_code}")
