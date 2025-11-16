

import re
from typing import Any


def _to_float(val: Any) -> float:
    """Convert value to float safely."""
    if isinstance(val, (int, float)):
        return float(val)
    return float(str(val))

def _safe_numeric_compare(op_func, left: Any, right: Any) -> bool:
    """Safely compare two values as numbers."""
    try:
        return op_func(_to_float(left), _to_float(right))
    except (ValueError, TypeError):
        return False


def _normalize_string(value: str) -> str:
    """Normalize string for case-insensitive comparison."""
    return str(value).lower()


def _contains(value: Any, pattern: Any) -> bool:
    """Check if value contains pattern(s)."""
    if value is None:
        return False
    normalized_value = _normalize_string(value)
    if isinstance(pattern, list):
        return any(_normalize_string(p) in normalized_value for p in pattern)
    return _normalize_string(pattern) in normalized_value


def _startswith(value: Any, pattern: Any) -> bool:
    """Check if value starts with pattern(s)."""
    if value is None:
        return False
    normalized_value = _normalize_string(value)
    if isinstance(pattern, list):
        return any(normalized_value.startswith(_normalize_string(p)) for p in pattern)
    return normalized_value.startswith(_normalize_string(pattern))


def _endswith(value: Any, pattern: Any) -> bool:
    """Check if value ends with pattern(s)."""
    if value is None:
        return False
    normalized_value = _normalize_string(value)
    if isinstance(pattern, list):
        return any(normalized_value.endswith(_normalize_string(p)) for p in pattern)
    return normalized_value.endswith(_normalize_string(pattern))


def _regex(value: Any, pattern: Any) -> bool:
    """Check if value matches regex pattern(s)."""
    if value is None:
        return False
    try:
        if isinstance(pattern, list):
            return any(
                re.search(str(p), str(value), flags=re.IGNORECASE) is not None
                for p in pattern
            )
        return re.search(str(pattern), str(value), flags=re.IGNORECASE) is not None
    except re.error:
        return False


def _eq(left: Any, right: Any) -> bool:
    """Check equality (numeric when possible, else string)."""
    try:
        return _to_float(left) == _to_float(right)
    except (ValueError, TypeError):
        return str(left) == str(right)


def _neq(left: Any, right: Any) -> bool:
    """Check inequality."""
    return not _eq(left, right)

