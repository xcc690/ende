# -*- mode: python ; coding: utf-8 -*-
import os
import platform

block_cipher = None
project_root = os.path.dirname(os.path.abspath(SPEC))
is_mac = platform.system() == 'Darwin'

a = Analysis(
    ['main.py'],
    pathex=[project_root],
    binaries=[],
    datas=[
        ('js_engine', 'js_engine'),
        ('addons', 'addons'),
        ('core', 'core'),
    ],
    hiddenimports=[
        'PyQt5.sip',
        'gui.main_window',
        'gui.gateway_tab',
        'gui.log_panel',
        'core.config_center',
        'core.gateway_manager',
        'core.crypto_service',
        'core.match_engine',
        'core.path_utils',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['tkinter', 'matplotlib', 'numpy', 'scipy'],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

if is_mac:
    exe = EXE(
        pyz,
        a.scripts,
        [],
        exclude_binaries=True,
        name='CryptoProxy',
        debug=False,
        strip=False,
        upx=False,
        console=False,
    )
    coll = COLLECT(
        exe,
        a.binaries,
        a.zipfiles,
        a.datas,
        strip=False,
        upx=False,
        name='CryptoProxy',
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
    exe = EXE(
        pyz,
        a.scripts,
        [],
        exclude_binaries=True,
        name='CryptoProxy',
        debug=False,
        strip=False,
        upx=True,
        console=False,
        icon=None,
    )
    coll = COLLECT(
        exe,
        a.binaries,
        a.zipfiles,
        a.datas,
        strip=False,
        upx=True,
        name='CryptoProxy',
    )
