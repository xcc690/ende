/**
 * 加解密引擎 - 统一 JS 实现
 * 支持: AES, DES, 3DES, RSA, SM2, SM3, SM4, Hash(MD5/SHA), HMAC, Base64, RC4
 */

const CryptoJS = require('crypto-js');
const sm = require('sm-crypto');
const forge = require('node-forge');

// ==================== 工具函数 ====================

function parseEncoding(data, encoding) {
    switch (encoding) {
        case 'base64': return CryptoJS.enc.Base64.parse(data);
        case 'hex': return CryptoJS.enc.Hex.parse(data);
        case 'utf-8':
        default: return CryptoJS.enc.Utf8.parse(data);
    }
}

function formatOutput(wordArray, encoding) {
    switch (encoding) {
        case 'base64': return CryptoJS.enc.Base64.stringify(wordArray);
        case 'hex': return CryptoJS.enc.Hex.stringify(wordArray);
        case 'utf-8':
        default: return CryptoJS.enc.Utf8.stringify(wordArray);
    }
}

function getCryptoJSMode(mode) {
    const modes = {
        'CBC': CryptoJS.mode.CBC,
        'ECB': CryptoJS.mode.ECB,
        'CFB': CryptoJS.mode.CFB,
        'OFB': CryptoJS.mode.OFB,
        'CTR': CryptoJS.mode.CTR
    };
    return modes[mode] || CryptoJS.mode.CBC;
}

function getCryptoJSPadding(padding) {
    const paddings = {
        'PKCS7': CryptoJS.pad.Pkcs7,
        'ZeroPadding': CryptoJS.pad.ZeroPadding,
        'NoPadding': CryptoJS.pad.NoPadding,
        'Iso10126': CryptoJS.pad.Iso10126,
        'Iso97971': CryptoJS.pad.Iso97971,
        'AnsiX923': CryptoJS.pad.AnsiX923
    };
    return paddings[padding] || CryptoJS.pad.Pkcs7;
}

// ==================== AES ====================

function aes_encrypt(plaintext, params) {
    var key = parseEncoding(params.key, params.key_encoding || 'utf-8');
    var iv = parseEncoding(params.iv || '', params.key_encoding || 'utf-8');
    var data = plaintext;
    var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: getCryptoJSMode(params.mode || 'CBC'),
        padding: getCryptoJSPadding(params.padding || 'PKCS7')
    });
    var outputEnc = params.output_encoding || 'base64';
    if (outputEnc === 'base64') return encrypted.toString();
    if (outputEnc === 'hex') return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    return encrypted.toString();
}

function aes_decrypt(ciphertext, params) {
    var key = parseEncoding(params.key, params.key_encoding || 'utf-8');
    var iv = parseEncoding(params.iv || '', params.key_encoding || 'utf-8');
    var outputEnc = params.output_encoding || 'base64';
    var cipherParams;
    if (outputEnc === 'hex') {
        cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
        });
    } else {
        cipherParams = ciphertext;
    }
    var decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
        iv: iv,
        mode: getCryptoJSMode(params.mode || 'CBC'),
        padding: getCryptoJSPadding(params.padding || 'PKCS7')
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// ==================== DES ====================

function des_encrypt(plaintext, params) {
    var key = parseEncoding(params.key, params.key_encoding || 'utf-8');
    var iv = parseEncoding(params.iv || '', params.key_encoding || 'utf-8');
    var encrypted = CryptoJS.DES.encrypt(plaintext, key, {
        iv: iv,
        mode: getCryptoJSMode(params.mode || 'CBC'),
        padding: getCryptoJSPadding(params.padding || 'PKCS7')
    });
    var outputEnc = params.output_encoding || 'base64';
    if (outputEnc === 'hex') return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    return encrypted.toString();
}

function des_decrypt(ciphertext, params) {
    var key = parseEncoding(params.key, params.key_encoding || 'utf-8');
    var iv = parseEncoding(params.iv || '', params.key_encoding || 'utf-8');
    var outputEnc = params.output_encoding || 'base64';
    var cipherParams;
    if (outputEnc === 'hex') {
        cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
        });
    } else {
        cipherParams = ciphertext;
    }
    var decrypted = CryptoJS.DES.decrypt(cipherParams, key, {
        iv: iv,
        mode: getCryptoJSMode(params.mode || 'CBC'),
        padding: getCryptoJSPadding(params.padding || 'PKCS7')
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// ==================== 3DES ====================

function triple_des_encrypt(plaintext, params) {
    var key = parseEncoding(params.key, params.key_encoding || 'utf-8');
    var iv = parseEncoding(params.iv || '', params.key_encoding || 'utf-8');
    var encrypted = CryptoJS.TripleDES.encrypt(plaintext, key, {
        iv: iv,
        mode: getCryptoJSMode(params.mode || 'CBC'),
        padding: getCryptoJSPadding(params.padding || 'PKCS7')
    });
    var outputEnc = params.output_encoding || 'base64';
    if (outputEnc === 'hex') return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    return encrypted.toString();
}

function triple_des_decrypt(ciphertext, params) {
    var key = parseEncoding(params.key, params.key_encoding || 'utf-8');
    var iv = parseEncoding(params.iv || '', params.key_encoding || 'utf-8');
    var outputEnc = params.output_encoding || 'base64';
    var cipherParams;
    if (outputEnc === 'hex') {
        cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
        });
    } else {
        cipherParams = ciphertext;
    }
    var decrypted = CryptoJS.TripleDES.decrypt(cipherParams, key, {
        iv: iv,
        mode: getCryptoJSMode(params.mode || 'CBC'),
        padding: getCryptoJSPadding(params.padding || 'PKCS7')
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// ==================== RC4 ====================

function rc4_encrypt(plaintext, params) {
    var key = parseEncoding(params.key, params.key_encoding || 'utf-8');
    var encrypted = CryptoJS.RC4.encrypt(plaintext, key);
    var outputEnc = params.output_encoding || 'base64';
    if (outputEnc === 'hex') return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    return encrypted.toString();
}

function rc4_decrypt(ciphertext, params) {
    var key = parseEncoding(params.key, params.key_encoding || 'utf-8');
    var outputEnc = params.output_encoding || 'base64';
    var cipherParams;
    if (outputEnc === 'hex') {
        cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
        });
    } else {
        cipherParams = ciphertext;
    }
    var decrypted = CryptoJS.RC4.decrypt(cipherParams, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// ==================== RSA (node-forge) ====================

function decodeKey(keyStr, encoding) {
    if (!encoding || encoding === 'pem') return keyStr;
    var raw;
    if (encoding === 'base64') {
        raw = forge.util.decode64(keyStr);
    } else if (encoding === 'hex') {
        raw = forge.util.hexToBytes(keyStr);
    } else {
        return keyStr;
    }
    return raw;
}

function loadPublicKey(params) {
    var keyStr = params.public_key;
    var enc = params.key_encoding || 'pem';
    if (enc === 'pem') {
        return forge.pki.publicKeyFromPem(keyStr);
    }
    var der = decodeKey(keyStr, enc);
    var asn1 = forge.asn1.fromDer(der);
    return forge.pki.publicKeyFromAsn1(asn1);
}

function loadPrivateKey(params) {
    var keyStr = params.private_key;
    var enc = params.key_encoding || 'pem';
    if (enc === 'pem') {
        return forge.pki.privateKeyFromPem(keyStr);
    }
    var der = decodeKey(keyStr, enc);
    var asn1 = forge.asn1.fromDer(der);
    return forge.pki.privateKeyFromAsn1(asn1);
}

function rsa_encrypt(plaintext, params) {
    var outputEnc = params.output_encoding || 'base64';
    var padding = params.padding || 'OAEP';
    var encryptWith = params.encrypt_with || 'public';
    var key;
    if (encryptWith === 'public') {
        key = loadPublicKey(params);
    } else {
        key = loadPrivateKey(params);
    }
    var encrypted;
    if (encryptWith === 'public') {
        if (padding === 'OAEP') {
            encrypted = key.encrypt(plaintext, 'RSA-OAEP');
        } else {
            encrypted = key.encrypt(plaintext, 'RSAES-PKCS1-V1_5');
        }
    } else {
        encrypted = forge.pki.rsa.encrypt(
            forge.util.createBuffer(plaintext, 'utf8').getBytes(),
            key, 0x01
        );
    }
    if (outputEnc === 'hex') return forge.util.bytesToHex(encrypted);
    return forge.util.encode64(encrypted);
}

function rsa_decrypt(ciphertext, params) {
    var outputEnc = params.output_encoding || 'base64';
    var padding = params.padding || 'OAEP';
    var data;
    if (outputEnc === 'hex') {
        data = forge.util.hexToBytes(ciphertext);
    } else {
        data = forge.util.decode64(ciphertext);
    }
    var key = loadPrivateKey(params);
    var decrypted;
    if (padding === 'OAEP') {
        decrypted = key.decrypt(data, 'RSA-OAEP');
    } else {
        decrypted = key.decrypt(data, 'RSAES-PKCS1-V1_5');
    }
    return decrypted;
}

function rsa_generate_keypair(params) {
    var bits = parseInt(params.bits) || 2048;
    var keypair = forge.pki.rsa.generateKeyPair({bits: bits});
    return JSON.stringify({
        public_key: forge.pki.publicKeyToPem(keypair.publicKey),
        private_key: forge.pki.privateKeyToPem(keypair.privateKey)
    });
}

// ==================== SM2 ====================

function convertKeyToHex(keyStr, encoding) {
    if (!encoding || encoding === 'hex') return keyStr;
    if (encoding === 'base64') {
        return Buffer.from(keyStr, 'base64').toString('hex');
    }
    return keyStr;
}

function sm2_encrypt(plaintext, params) {
    var publicKey = convertKeyToHex(params.public_key, params.key_encoding);
    var cipherMode = parseInt(params.cipher_mode) || 1;
    var encrypted = sm.sm2.doEncrypt(plaintext, publicKey, cipherMode);
    if (params.prefix_04 === 'true' || params.prefix_04 === true) {
        encrypted = '04' + encrypted;
    }
    return encrypted;
}

function sm2_decrypt(ciphertext, params) {
    var privateKey = convertKeyToHex(params.private_key, params.key_encoding);
    var cipherMode = parseInt(params.cipher_mode) || 1;
    if (params.prefix_04 === 'true' || params.prefix_04 === true) {
        if (ciphertext.startsWith('04')) {
            ciphertext = ciphertext.substring(2);
        }
    }
    var decrypted = sm.sm2.doDecrypt(ciphertext, privateKey, cipherMode);
    return decrypted;
}

function sm2_sign(data, params) {
    var privateKey = convertKeyToHex(params.private_key, params.key_encoding);
    var signature = sm.sm2.doSignature(data, privateKey);
    return signature;
}

function sm2_verify(data, params) {
    var publicKey = convertKeyToHex(params.public_key, params.key_encoding);
    var signature = params.signature;
    var result = sm.sm2.doVerifySignature(data, signature, publicKey);
    return result.toString();
}

function sm2_generate_keypair() {
    var keypair = sm.sm2.generateKeyPairHex();
    return JSON.stringify({
        public_key: keypair.publicKey,
        private_key: keypair.privateKey
    });
}

// ==================== SM3 ====================

function sm3_hash(data, params) {
    var result = sm.sm3(data);
    return result;
}

// ==================== SM4 ====================

function sm4_encrypt(plaintext, params) {
    var key = params.key;
    var mode = params.mode || 'ecb';
    var iv = params.iv || '';
    var outputEnc = params.output_encoding || 'hex';
    var result;
    if (mode === 'cbc') {
        result = sm.sm4.encrypt(plaintext, key, {mode: 'cbc', iv: iv, output: 'array'});
    } else {
        result = sm.sm4.encrypt(plaintext, key, {output: 'array'});
    }
    var hex = Array.from(result).map(function(b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    if (outputEnc === 'base64') {
        return Buffer.from(hex, 'hex').toString('base64');
    }
    return hex;
}

function sm4_decrypt(ciphertext, params) {
    var key = params.key;
    var mode = params.mode || 'ecb';
    var iv = params.iv || '';
    var outputEnc = params.output_encoding || 'hex';
    var data;
    if (outputEnc === 'base64') {
        data = Buffer.from(ciphertext, 'base64').toString('hex');
    } else {
        data = ciphertext;
    }
    var bytes = [];
    for (var i = 0; i < data.length; i += 2) {
        bytes.push(parseInt(data.substr(i, 2), 16));
    }
    var result;
    if (mode === 'cbc') {
        result = sm.sm4.decrypt(bytes, key, {mode: 'cbc', iv: iv, output: 'utf8'});
    } else {
        result = sm.sm4.decrypt(bytes, key, {output: 'utf8'});
    }
    return result;
}

// ==================== Hash (MD5/SHA) ====================

function hash_digest(data, params) {
    var algorithm = params.hash_algorithm || 'md5';
    var outputEnc = params.output_encoding || 'hex';
    var result;
    switch (algorithm.toLowerCase()) {
        case 'md5':
            result = CryptoJS.MD5(data); break;
        case 'sha1':
            result = CryptoJS.SHA1(data); break;
        case 'sha256':
            result = CryptoJS.SHA256(data); break;
        case 'sha512':
            result = CryptoJS.SHA512(data); break;
        case 'sha224':
            result = CryptoJS.SHA224(data); break;
        case 'sha384':
            result = CryptoJS.SHA384(data); break;
        case 'sha3':
            result = CryptoJS.SHA3(data); break;
        case 'ripemd160':
            result = CryptoJS.RIPEMD160(data); break;
        default:
            result = CryptoJS.MD5(data);
    }
    return formatOutput(result, outputEnc);
}

// ==================== HMAC ====================

function hmac_digest(data, params) {
    var key = params.key || '';
    var algorithm = params.hash_algorithm || 'sha256';
    var outputEnc = params.output_encoding || 'hex';
    var result;
    switch (algorithm.toLowerCase()) {
        case 'md5':
            result = CryptoJS.HmacMD5(data, key); break;
        case 'sha1':
            result = CryptoJS.HmacSHA1(data, key); break;
        case 'sha256':
            result = CryptoJS.HmacSHA256(data, key); break;
        case 'sha512':
            result = CryptoJS.HmacSHA512(data, key); break;
        case 'sha224':
            result = CryptoJS.HmacSHA224(data, key); break;
        case 'sha384':
            result = CryptoJS.HmacSHA384(data, key); break;
        default:
            result = CryptoJS.HmacSHA256(data, key);
    }
    return formatOutput(result, outputEnc);
}

// ==================== Base64 ====================

function base64_encode(data) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
}

function base64_decode(data) {
    return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(data));
}

// ==================== 统一调度 ====================

function dispatch(action, algorithm, data, paramsJson) {
    var params = JSON.parse(paramsJson);
    var algo = algorithm.toLowerCase();
    if (action === 'encrypt') {
        switch (algo) {
            case 'aes': return aes_encrypt(data, params);
            case 'des': return des_encrypt(data, params);
            case '3des': return triple_des_encrypt(data, params);
            case 'rc4': return rc4_encrypt(data, params);
            case 'rsa': return rsa_encrypt(data, params);
            case 'sm2': return sm2_encrypt(data, params);
            case 'sm4': return sm4_encrypt(data, params);
            case 'base64': return base64_encode(data);
            case 'hash': return hash_digest(data, params);
            case 'hmac': return hmac_digest(data, params);
            case 'sm3': return sm3_hash(data, params);
            default: throw new Error('不支持的算法: ' + algorithm);
        }
    } else if (action === 'decrypt') {
        switch (algo) {
            case 'aes': return aes_decrypt(data, params);
            case 'des': return des_decrypt(data, params);
            case '3des': return triple_des_decrypt(data, params);
            case 'rc4': return rc4_decrypt(data, params);
            case 'rsa': return rsa_decrypt(data, params);
            case 'sm2': return sm2_decrypt(data, params);
            case 'sm4': return sm4_decrypt(data, params);
            case 'base64': return base64_decode(data);
            case 'hash': return hash_digest(data, params);
            case 'hmac': return hmac_digest(data, params);
            case 'sm3': return sm3_hash(data, params);
            default: throw new Error('不支持的算法: ' + algorithm);
        }
    } else if (action === 'sign') {
        if (algo === 'sm2') return sm2_sign(data, params);
        throw new Error('签名仅支持 SM2');
    } else if (action === 'verify') {
        if (algo === 'sm2') return sm2_verify(data, params);
        throw new Error('验签仅支持 SM2');
    } else if (action === 'generate_keypair') {
        if (algo === 'rsa') return rsa_generate_keypair(params);
        if (algo === 'sm2') return sm2_generate_keypair();
        throw new Error('密钥生成仅支持 RSA/SM2');
    }
    throw new Error('不支持的操作: ' + action);
}

module.exports = { dispatch };
