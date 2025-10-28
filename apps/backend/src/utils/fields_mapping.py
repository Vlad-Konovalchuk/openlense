import jmespath
from typing import Dict, Any


def extract_fields(item: Dict[str, Any], mapping: Dict[str, str]) -> Dict[str, Any]:
    result = {}
    for target_field, expression in mapping.items():
        try:
            result[target_field] = jmespath.search(expression, item)
        except Exception:
            result[target_field] = None
    return result
