# -*- mode: python ; coding: utf-8 -*-
import os
import sys
import platform
import shutil

block_cipher = None
project_root = os.path.dirname(os.path.abspath(SPEC))
is_mac = platform.system() == 'Darwin'

common_excludes = [
    'tkinter', 'matplotlib', 'numpy', 'scipy', 'pandas',
    'PyQt6', 'PySide2', 'PySide6',
    'sphinx', 'docutils', 'nbformat', 'nbconvert', 'notebook',
    'jupyter', 'jupyterlab', 'IPython', 'ipykernel', 'ipywidgets',
    'black', 'yapf', 'blib2to3',
    'test', 'tests', 'unittest',
]

# ── Main GUI app ──
main_datas = [
    ('js_engine', 'js_engine'),
    ('addons', 'addons'),
    ('core', 'core'),
    ('gui', 'gui'),
    ('app_icon.ico', '.'),
]
if not is_mac and os.path.exists(os.path.join(project_root, 'jsrpc.exe')):
    main_datas.append(('jsrpc.exe', '.'))

node_path = shutil.which('node')
main_binaries = []
if node_path and not is_mac:
    main_binaries.append((node_path, '.'))

main_a = Analysis(
    ['main.py'],
    pathex=[project_root],
    binaries=main_binaries,
    datas=main_datas,
    hiddenimports=[
        'PyQt5.sip',
        'gui.main_window',
        'gui.gateway_tab',
        'gui.log_panel',
        'gui.match_dialog',
        'gui.network_dialog',
        'gui.algo_params',
        'gui.theme',
        'core.config_center',
        'core.gateway_manager',
        'core.crypto_service',
        'core.match_engine',
        'core.path_utils',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=common_excludes,
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)
main_pyz = PYZ(main_a.pure, main_a.zipped_data, cipher=block_cipher)

# ── mitmdump subprocess exe ──
mitm_excludes = common_excludes + ['PyQt5']

mitm_a = Analysis(
    ['mitmdump_entry.py'],
    pathex=[project_root],
    binaries=[],
    datas=[],
    hiddenimports=[
        'mitmproxy.addons',
        'mitmproxy.addons.default_addons',
        'mitmproxy.tools.dump',
        'mitmproxy.tools.main',
        'mitmproxy.net',
        'mitmproxy.proxy',
        'mitmproxy.script',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=mitm_excludes,
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)
mitm_pyz = PYZ(mitm_a.pure, mitm_a.zipped_data, cipher=block_cipher)

MERGE(
    (main_a, 'CryptoProxy', 'CryptoProxy'),
    (mitm_a, 'mitmdump', 'mitmdump'),
)

if is_mac:
    main_exe = EXE(
        main_pyz, main_a.scripts, [],
        exclude_binaries=True,
        name='CryptoProxy',
        debug=False, strip=False, upx=False, console=False,
    )
    mitm_exe = EXE(
        mitm_pyz, mitm_a.scripts, [],
        exclude_binaries=True,
        name='mitmdump',
        debug=False, strip=False, upx=False, console=True,
    )
    coll = COLLECT(
        main_exe, main_a.binaries, main_a.zipfiles, main_a.datas,
        mitm_exe, mitm_a.binaries, mitm_a.zipfiles, mitm_a.datas,
        strip=False, upx=False, name='CryptoProxy',
    )
    app = BUNDLE(
        coll,
        name='CryptoProxy.app',
        icon=None,
        bundle_identifier='com.ende.cryptoproxy',
        info_plist={
            'CFBundleDisplayName': 'CryptoProxy',
            'CFBundleShortVersionString': '1.0.0',
            'NSHighResolutionCapable': True,
        },
    )
else:
    main_exe = EXE(
        main_pyz, main_a.scripts, [],
        exclude_binaries=True,
        name='CryptoProxy',
        debug=False, strip=False, upx=True, console=False,
        icon=os.path.join(project_root, 'app_icon.ico'),
    )
    mitm_exe = EXE(
        mitm_pyz, mitm_a.scripts, [],
        exclude_binaries=True,
        name='mitmdump',
        debug=False, strip=False, upx=True, console=True,
    )
    coll = COLLECT(
        main_exe, main_a.binaries, main_a.zipfiles, main_a.datas,
        mitm_exe, mitm_a.binaries, mitm_a.zipfiles, mitm_a.datas,
        strip=False, upx=True, name='CryptoProxy',
    )
