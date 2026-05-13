"""算法参数定义 - 供 gateway_tab 和 match_dialog 共用"""

ALGORITHMS = ["AES", "DES", "3DES", "RC4", "RSA", "SM2", "SM3", "SM4", "Hash", "HMAC", "Base64", "Hex"]

ALGO_PARAMS = {
    "AES": [
        ("key", "密钥", "line", ""),
        ("iv", "IV", "line", ""),
        ("mode", "模式", "combo", ["CBC", "ECB", "CFB", "OFB", "CTR"]),
        ("padding", "填充", "combo", ["PKCS7", "ZeroPadding", "NoPadding"]),
        ("output_encoding", "输出编码", "combo", ["base64", "hex"]),
        ("key_encoding", "密钥编码", "combo", ["utf-8", "hex", "base64"]),
    ],
    "DES": [
        ("key", "密钥", "line", ""),
        ("iv", "IV", "line", ""),
        ("mode", "模式", "combo", ["CBC", "ECB"]),
        ("padding", "填充", "combo", ["PKCS7", "ZeroPadding", "NoPadding"]),
        ("output_encoding", "输出编码", "combo", ["base64", "hex"]),
        ("key_encoding", "密钥编码", "combo", ["utf-8", "hex", "base64"]),
    ],
    "3DES": [
        ("key", "密钥", "line", ""),
        ("iv", "IV", "line", ""),
        ("mode", "模式", "combo", ["CBC", "ECB"]),
        ("padding", "填充", "combo", ["PKCS7", "ZeroPadding", "NoPadding"]),
        ("output_encoding", "输出编码", "combo", ["base64", "hex"]),
        ("key_encoding", "密钥编码", "combo", ["utf-8", "hex", "base64"]),
    ],
    "RC4": [
        ("key", "密钥", "line", ""),
        ("output_encoding", "输出编码", "combo", ["base64", "hex"]),
        ("key_encoding", "密钥编码", "combo", ["utf-8", "hex", "base64"]),
    ],
    "RSA": [
        ("key_encoding", "密钥编码", "combo", ["pem", "base64", "hex"]),
        ("encrypt_with", "加密方式", "combo", ["public", "private"]),
        ("public_key", "Public Key", "text", ""),
        ("private_key", "Private Key", "text", ""),
        ("padding", "Padding", "combo", ["OAEP", "PKCS1_v1_5"]),
        ("output_encoding", "输出编码", "combo", ["base64", "hex"]),
    ],
    "SM2": [
        ("key_encoding", "密钥编码", "combo", ["hex", "base64"]),
        ("public_key", "Public Key", "text", ""),
        ("private_key", "Private Key", "text", ""),
        ("cipher_mode", "密文格式", "combo", ["1", "0"]),
        ("prefix_04", "密文前缀04", "combo", ["false", "true"]),
    ],
    "SM3": [],
    "SM4": [
        ("key", "密钥 (Hex)", "line", ""),
        ("iv", "IV (Hex)", "line", ""),
        ("mode", "模式", "combo", ["cbc", "ecb"]),
        ("output_encoding", "输出编码", "combo", ["hex", "base64"]),
    ],
    "Hash": [
        ("hash_algorithm", "哈希算法", "combo", ["md5", "sha1", "sha256", "sha512"]),
        ("output_encoding", "输出编码", "combo", ["hex", "base64"]),
    ],
    "HMAC": [
        ("key", "密钥", "line", ""),
        ("hash_algorithm", "哈希算法", "combo", ["md5", "sha1", "sha256", "sha512"]),
        ("output_encoding", "输出编码", "combo", ["hex", "base64"]),
    ],
    "Base64": [],
}
