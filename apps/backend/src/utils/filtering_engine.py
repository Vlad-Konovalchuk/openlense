from typing import Any, Dict, List
import operator
import re
import jmespath

# Operator aliases for friendlier admin UI names
OP_ALIASES: Dict[str, str] = {
    "equals": "eq",
    "not_equals": "neq",
}


def _to_float(val: Any) -> float:
    if isinstance(val, (int, float)):
        return float(val)
    return float(str(val))


def _safe_numeric_compare(op_func, left: Any, right: Any) -> bool:
    try:
        return op_func(_to_float(left), _to_float(right))
    except Exception:
        return False


def _contains(value: Any, pattern: Any) -> bool:
    if value is None:
        return False
    if isinstance(pattern, list):
        return any(p.lower() in str(value).lower() for p in pattern)
    return str(pattern).lower() in str(value).lower()


def _startswith(value: Any, pattern: Any) -> bool:
    if value is None:
        return False
    if isinstance(pattern, list):
        return any(str(value).lower().startswith(str(p).lower()) for p in pattern)
    return str(value).lower().startswith(str(pattern).lower())


def _endswith(value: Any, pattern: Any) -> bool:
    if value is None:
        return False
    if isinstance(pattern, list):
        return any(str(value).lower().endswith(str(p).lower()) for p in pattern)
    return str(value).lower().endswith(str(pattern).lower())


def _regex(value: Any, pattern: Any) -> bool:
    if value is None:
        return False
    if isinstance(pattern, list):
        return any(
            re.search(str(p), str(value), flags=re.IGNORECASE) is not None
            for p in pattern
        )
    return re.search(str(pattern), str(value), flags=re.IGNORECASE) is not None


def _eq(left: Any, right: Any) -> bool:
    # numeric equality when possible, else string/primitive equality
    try:
        return _to_float(left) == _to_float(right)
    except Exception:
        return str(left) == str(right)


def _neq(left: Any, right: Any) -> bool:
    return not _eq(left, right)


OPS = {
    "eq": _eq,
    "neq": _neq,
    "gt": lambda left, right: _safe_numeric_compare(operator.gt, left, right),
    "gte": lambda left, right: _safe_numeric_compare(operator.ge, left, right),
    "lt": lambda left, right: _safe_numeric_compare(operator.lt, left, right),
    "lte": lambda left, right: _safe_numeric_compare(operator.le, left, right),
    "contains": _contains,
    "startswith": _startswith,
    "endswith": _endswith,
    "regex": _regex,
}

# Which operators are suitable per field type (for FE and validation)
ALLOWED_OPERATORS_BY_TYPE: Dict[str, List[str]] = {
    "string": ["eq", "neq", "contains", "startswith", "endswith", "regex"],
    "number": ["eq", "neq", "gt", "gte", "lt", "lte"],
    "boolean": ["eq", "neq"],
    "select": ["eq", "neq"],
}


def _contains(value: Any, pattern: Any) -> bool:
    if value is None:
        return False
    if isinstance(pattern, list):
        return any(p.lower() in str(value).lower() for p in pattern)
    return str(pattern).lower() in str(value).lower()


def match_single(value: Any, cond: Any, field_type: str | None = None) -> bool:
    """
    cond can be:
      - {"gt": 0.1, "lt": 1.0}
      - {"contains": ["bit", "token"]}
      - primitive (interpreted as eq)
    """
    if cond is None:
        return True
    if isinstance(cond, dict):
        for raw_op, operand in cond.items():
            op = OP_ALIASES.get(raw_op, raw_op)
            if field_type:
                allowed = ALLOWED_OPERATORS_BY_TYPE.get(field_type, [])
                if op not in allowed:
                    return False
            if op in OPS:
                return OPS[op](value, operand)
            else:
                # unknown op -> fail-safe = False
                return False
        return True
    else:
        # primitive cond means equality
        return OPS["eq"](value, cond)


def apply_filters(
    items: List[Dict], filter_descriptors: List[Any], filter_to_apply: Dict[str, Any]
) -> List[Dict]:
    """
    - filter_descriptors: list with entries {key, path, ...}
    - user_filters: {"price": {"gt":0.1}, "name": {"contains":["bit"]}}
    We use mapping to get the value from item (via jmespath if provided)
    """
    out: List[Dict] = []

    def _get_attr(obj: Any, name: str, default: Any = None) -> Any:
        if isinstance(obj, dict):
            return obj.get(name, default)
        return getattr(obj, name, default)

    for item in items:
        ok = True
        for desc in filter_descriptors or []:
            key = _get_attr(desc, "key")
            field_type = _get_attr(desc, "type")
            path = _get_attr(desc, "path") or key

            if key not in (filter_to_apply or {}):
                continue  # user didn't provide this filter
            cond = filter_to_apply[key]
            try:
                val = jmespath.search(path, item)
            except Exception:
                val = None
            if not match_single(val, cond, field_type):
                ok = False
                break
        if ok:
            out.append(item)
    return out


def supported_operators_for_field_type(field_type: str) -> List[Dict[str, str]]:
    """Return list of operator descriptors for FE consumption.

    Each operator descriptor has: id (machine name) and label (human name).
    """
    labels = {
        "eq": "Equals",
        "neq": "Not equals",
        "gt": "Greater than",
        "gte": "Greater or equal",
        "lt": "Less than",
        "lte": "Less or equal",
        "contains": "Contains",
        "startswith": "Starts with",
        "endswith": "Ends with",
        "regex": "Matches regex",
    }
    ops = ALLOWED_OPERATORS_BY_TYPE.get(field_type, [])
    return [{"id": op, "label": labels.get(op, op)} for op in ops]
