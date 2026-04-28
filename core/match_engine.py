"""匹配引擎 - 根据规则判断是否需要加解密"""

import re


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
    """
    flow_data 结构:
      request_headers: dict
      request_body: str
      response_body: str
    返回命中的规则列表
    """
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
    return matched
