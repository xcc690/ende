# CryptoProxy - 加解密链式代理工具

基于 mitmproxy 的加解密代理工具，通过中间人代理自动对 HTTP 请求/响应进行加密、解密处理。支持多种加密算法、链式解密、哈希前处理等场景，提供 PyQt5 图形界面进行配置和管理。

## 功能特性

- **多网关管理** — 同时运行多个代理网关，每个网关独立配置端口、目标地址、加解密规则
- **灵活的匹配规则** — 按请求体、响应体、请求头、GET 参数、响应 JSON 字段等维度匹配流量
- **每条规则独立算法配置** — 每条匹配规则可单独配置加密算法和参数，互不影响
- **链式解密** — 支持 JSON 响应中先解密密钥字段（如 SM2），再用解密出的密钥解密数据字段（如 SM4）
- **哈希前处理** — 加密前可对数据计算哈希，支持拼接到原值或写入指定参数
- **测试面板** — 可选择匹配规则直接测试加解密效果
- **JSRPC 支持** — 可对接远程 JS 加解密服务
- **打包发布** — 支持 PyInstaller 打包为独立 exe / macOS app

## 支持的算法

| 类型 | 算法 |
|------|------|
| 对称加密 | SM4 (ECB/CBC)、AES (ECB/CBC)、DES、3DES、RC4 |
| 非对称加密 | SM2 (C1C3C2/C1C2C3)、RSA |
| 哈希/摘要 | MD5、SHA1、SHA256、SHA512、SM3、HMAC |
| 编码 | Base64 |

## 安装

```bash
pip install -r requirements.txt
```

依赖：
- Python 3.8+
- PyQt5 >= 5.15
- mitmproxy >= 10.0
- Node.js（用于 JS 加解密引擎）

## 运行

```bash
python main.py
```

## 打包

Windows:
```bash
build.bat
```

macOS:
```bash
bash build_mac.sh
```

打包产物在 `dist/CryptoProxy/` 目录下。

## 项目结构

```
├── main.py                 # 程序入口
├── gui/                    # PyQt5 界面
│   ├── main_window.py      # 主窗口
│   ├── gateway_tab.py      # 网关配置标签页（含测试面板）
│   ├── match_dialog.py     # 匹配规则配置对话框
│   ├── algo_params.py      # 算法参数定义（共享常量）
│   ├── theme.py            # Catppuccin Mocha 暗色主题
│   └── ...
├── core/                   # 核心逻辑
│   ├── crypto_service.py   # 加解密服务（JS 引擎封装）
│   ├── match_engine.py     # 流量匹配引擎
│   ├── gateway_manager.py  # 网关进程管理
│   └── config_center.py    # 配置持久化
├── addons/                 # mitmproxy 插件
│   ├── crypto_addon.py     # 加解密网关（双向）
│   ├── encrypt_addon.py    # 加密网关
│   └── decrypt_addon.py    # 解密网关
├── js_engine/
│   └── crypto_engine.js    # Node.js 加解密实现
├── build.spec              # PyInstaller 打包配置
└── requirements.txt
```

## 使用场景

1. **接口调试** — 拦截加密请求，自动解密查看明文；或将明文请求自动加密后转发
2. **链式解密** — 响应中密钥和数据分别加密的场景（如 SM2 加密的 SM4 密钥 + SM4 加密的数据）
3. **签名计算** — GET 参数先计算哈希签名，拼接后再加密
4. **批量参数加密** — 一键加密所有 GET 参数或指定参数

## License

MIT
