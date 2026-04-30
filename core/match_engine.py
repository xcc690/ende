"""匹配引擎 - 根据规则判断是否需要加解密"""

import json
import re


def _get_json_value(obj, path: str):
    keys = path.split(".")
    val = obj
    for k in keys:
        if isinstance(val, dict) and k in val:
            val = val[k]
        else:
            return None
    return val


def match_rule(rule: dict, text: str) -> bool:
    keyword = rule.get("keyword", "")
    mode = rule.get("match_mode", "contains")

    if mode == "all":
        return True
    elif mode == "contains":
        return keyword in text
    elif mode == "equals":
        return text == keyword
    elif mode == "startswith":
        return text.startswith(keyword)
    elif mode == "regex":
        try:
            return bool(re.search(keyword, text))
        except re.error:
            return False
    return False


def find_matching_rules(rules: list, flow_data: dict) -> list:
    matched = []
    for rule in rules:
        target = rule.get("target", "")
        if target == "request_header":
            header_name = rule.get("header_name", "")
            header_val = flow_data.get("request_headers", {}).get(header_name, "")
            if match_rule(rule, header_val):
                matched.append(rule)
        elif target == "request_body":
            body = flow_data.get("request_body", "")
            if match_rule(rule, body):
                matched.append(rule)
        elif target == "response_body":
            body = flow_data.get("response_body", "")
            if match_rule(rule, body):
                matched.append(rule)
        elif target == "query_param_all":
            query_params = flow_data.get("query_params", {})
            if query_params:
                matched.append(rule)
        elif target == "query_param":
            param_name = rule.get("param_name", "")
            query_params = flow_data.get("query_params", {})
            param_val = query_params.get(param_name, "")
            if param_val and match_rule(rule, param_val):
                matched.append(rule)
        elif target == "response_json_field":
            resp_body = flow_data.get("response_body", "")
            json_path = rule.get("json_path", "")
            if resp_body and json_path:
                try:
                    obj = json.loads(resp_body)
                    val = _get_json_value(obj, json_path)
                    if val is not None:
                        matched.append(rule)
                except (json.JSONDecodeError, TypeError):
                    pass
    return matched
