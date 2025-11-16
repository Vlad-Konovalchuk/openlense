from typing import Any, Dict, List
import operator
import re
import jmespath
from functools import lru_cache


# Operator aliases for friendlier admin UI names
OP_ALIASES: Dict[str, str] = {
    "equals": "eq",
    "not_equals": "neq",
}

# Operator labels for frontend display
OPERATOR_LABELS: Dict[str, str] = {
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


def _format_filter_log(
    filters: Dict[str, Any], descriptors: List[Dict[str, Any]]
) -> str:
    """Format filter information for readable logging."""
    lines = ["Applying filters:"]

    # Create a descriptor lookup for labels
    desc_lookup = {d.get("key"): d for d in (descriptors or [])}

    for field_key, conditions in filters.items():
        desc = desc_lookup.get(field_key, {})
        label = desc.get("label", field_key)
        lines.append(f"  - {label} ({field_key}):")

        if isinstance(conditions, dict):
            for op, value in conditions.items():
                op_label = OPERATOR_LABELS.get(op, op)
                lines.append(f"      {op_label}: {value}")
        else:
            lines.append(f"      {conditions}")

    return "\n".join(lines)


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


# Operator registry mapping to functions
OPS: Dict[str, Any] = {
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


def match_single(value: Any, cond: Any, field_type: str | None = None) -> bool:
    """
    Check if value matches a single condition.

    Args:
        value: The value to test
        cond: Can be:
            - {"gt": 0.1, "lt": 1.0}  # Complex condition
            - {"contains": ["bit", "token"]}  # Multiple patterns
            - primitive  # Interpreted as equality check
        field_type: Optional field type for operator validation

    Returns:
        True if value matches condition, False otherwise
    """
    if cond is None:
        return True

    if isinstance(cond, dict):
        for raw_op, operand in cond.items():
            op = OP_ALIASES.get(raw_op, raw_op)

            # Validate operator against field type if provided
            if field_type:
                allowed = ALLOWED_OPERATORS_BY_TYPE.get(field_type, [])
                if op not in allowed:
                    return False

            # Apply operator if it exists
            if op in OPS:
                if not OPS[op](value, operand):
                    return False
            else:
                # Unknown operator -> fail-safe
                return False
        return True
    else:
        # Primitive condition means equality check
        return OPS["eq"](value, cond)


def apply_filters(
    items: List[Dict], filter_descriptors: List[Any], filter_to_apply: Dict[str, Any]
) -> List[Dict]:
    """
    Apply backend filters to items.

    Args:
        items: List of items to filter
        filter_descriptors: List of filter configurations with keys like 'key', 'path', 'type'
        filter_to_apply: User's filter conditions {"price": {"gt":0.1}, "name": {"contains":["bit"]}}

    Returns:
        Filtered list of items that match all conditions
    """
    out: List[Dict] = []

    def _get_attr(obj: Any, name: str, default: Any = None) -> Any:
        """Get attribute from dict or object safely."""
        if isinstance(obj, dict):
            return obj.get(name, default)
        return getattr(obj, name, default)

    for item in items:
        all_conditions_met = True

        for desc in filter_descriptors or []:
            key = _get_attr(desc, "key")
            field_type = _get_attr(desc, "type")
            path = _get_attr(desc, "path") or key

            # Skip if user didn't provide filter for this field
            if key not in (filter_to_apply or {}):
                continue

            cond = filter_to_apply[key]

            # Extract value using JMESPath
            try:
                val = jmespath.search(path, item)
            except jmespath.exceptions.JMESPathError:
                val = None
            print(
                f"Filtering item on field '{key}' (path: '{path}') with value: {val} against condition: {cond}"
            )
            # Check if value matches condition
            if not match_single(val, cond, field_type):
                all_conditions_met = False
                break

        if all_conditions_met:
            out.append(item)

    return out


@lru_cache(maxsize=32)
def supported_operators_for_field_type(field_type: str) -> List[Dict[str, str]]:
    """
    Get supported operators for a field type (cached for performance).

    Args:
        field_type: One of 'string', 'number', 'boolean', 'select'

    Returns:
        List of operator descriptors with 'id' and 'label' keys
        Example: [{"id": "eq", "label": "Equals"}, ...]
    """
    ops = ALLOWED_OPERATORS_BY_TYPE.get(field_type, [])
    return [{"id": op, "label": OPERATOR_LABELS.get(op, op)} for op in ops]
