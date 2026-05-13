"""通用链式处理引擎"""

import re
import json
import urllib.parse


def extract_value(text: str, mode: str, pattern: str) -> tuple:
    """从文本中提取目标值。返回 (extracted_value, rebuild_info)"""
    if mode == "all" or not mode:
        return text, {"mode": "all"}

    if mode == "regex":
        m = re.search(pattern, text)
        if m:
            val = m.group(1) if m.lastindex else m.group(0)
            return val, {"mode": "regex", "match": m, "original": text}
        return text, {"mode": "all"}

    if mode == "json_path":
        try:
            obj = json.loads(text)
            keys = pattern.split(".")
            target = obj
            for k in keys:
                if isinstance(target, dict) and k in target:
                    target = target[k]
                else:
                    return text, {"mode": "all"}
            val = target if isinstance(target, str) else json.dumps(target, ensure_ascii=False)
            return val, {"mode": "json_path", "obj": obj, "path": keys, "original": text}
        except (json.JSONDecodeError, TypeError):
            return text, {"mode": "all"}

    if mode == "key_value":
        kv_pattern = re.escape(pattern) + r"=([^&]*)"
        m = re.search(kv_pattern, text)
        if m:
            val = urllib.parse.unquote(m.group(1))
            return val, {"mode": "key_value", "key": pattern, "original": text, "match": m}
        return text, {"mode": "all"}

    return text, {"mode": "all"}


def rebuild_value(result: str, info: dict) -> str:
    """将处理结果写回原始文本"""
    mode = info.get("mode", "all")

    if mode == "all":
        return result

    if mode == "regex":
        m = info["match"]
        original = info["original"]
        if m.lastindex:
            return original[:m.start(1)] + result + original[m.end(1):]
        return original[:m.start(0)] + result + original[m.end(0):]

    if mode == "json_path":
        obj = info["obj"]
        keys = info["path"]
        target = obj
        for k in keys[:-1]:
            target = target[k]
        try:
            target[keys[-1]] = json.loads(result)
        except (json.JSONDecodeError, TypeError):
            target[keys[-1]] = result
        return json.dumps(obj, ensure_ascii=False)

    if mode == "key_value":
        m = info["match"]
        original = info["original"]
        encoded = urllib.parse.quote(result, safe='')
        return original[:m.start(1)] + encoded + original[m.end(1):]

    return result


def process_chain(input_text: str, steps: list, crypto_service, jsrpc_engine=None) -> str:
    """执行链式处理管道。

    Args:
        input_text: 原始输入文本
        steps: 处理步骤列表
        crypto_service: GatewayCryptoService 实例
        jsrpc_engine: 可选的 JSRPCEngine 实例，供 engine=jsrpc 的步骤使用

    Returns:
        处理后的完整文本（已写回）
    """
    if not steps:
        return input_text

    current = input_text
    rebuild_stack = []

    for step in steps:
        extract_mode = step.get("extract_mode", "all")
        extract_pattern = step.get("extract_pattern", "")
        algorithm = step.get("algorithm", "")
        params = step.get("algorithm_params", {})
        action = step.get("action", "decrypt")
        engine = step.get("engine", "local")

        extracted, info = extract_value(current, extract_mode, extract_pattern)
        rebuild_stack.append(info)

        if engine == "jsrpc":
            rpc = jsrpc_engine
            if rpc is None and hasattr(crypto_service, '_jsrpc'):
                rpc = crypto_service._jsrpc
            if rpc is None and hasattr(crypto_service, '_get_jsrpc'):
                try:
                    rpc = crypto_service._get_jsrpc()
                except Exception:
                    pass
            if rpc:
                group = step.get("jsrpc_group", "")
                func = step.get("jsrpc_func", "")
                processed = rpc.call(group, func, extracted)
            else:
                processed = extracted
        elif algorithm:
            if action == "decrypt":
                processed = crypto_service.decrypt_with(algorithm, extracted, params)
            else:
                processed = crypto_service.encrypt_with(algorithm, extracted, params)
        else:
            processed = extracted

        if processed and processed.strip():
            current = processed
        else:
            current = extracted

    result = current
    for info in reversed(rebuild_stack):
        result = rebuild_value(result, info)

    return result
