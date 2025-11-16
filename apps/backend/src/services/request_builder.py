import os
from typing import Dict, Any, Optional
from pydantic import BaseModel
from src.db.sources import Source


class RequestBuilderPayload(BaseModel):
    source: Source
    user_filters: Dict[str, Any]


class BuiltRequest(BaseModel):
    url: str
    method: str
    params: Dict[str, Any]
    headers: Dict[str, str]
    data: Optional[Any] = None


def build_request_from_source(
    source: Dict[str, Any], user_filters: Dict[str, Any]
) -> BuiltRequest:
    """
    Build an HTTP request from a source dict and user filters.
    """
    source_dict = source
    url = source_dict["endpoint"]
    method = source_dict["method"]

    # Start with default headers
    headers: Dict[str, str] = {
        "Accepts": "application/json",
        "X-CMC_PRO_API_KEY": "{{CMC_API_KEY}}",
    }

    # Merge in any custom headers from source config
    custom_headers = source_dict.get("headers")
    if custom_headers:
        headers.update(custom_headers)

    # Replace placeholders in headers like "{{CMC_API_KEY}}"
    for header_name, header_value in list(headers.items()):
        if (
            isinstance(header_value, str)
            and "{{" in header_value
            and "}}" in header_value
        ):
            token_name = header_value.strip().strip("{} ")
            if token_name == "CMC_API_KEY":
                headers[header_name] = os.getenv("CMC_API_KEY", "")

    # Build params from user_filters mapped to API params
    params: Dict[str, Any] = {}
    api_filters = source_dict.get("api_filters", [])
    for filter_descriptor in api_filters:
        filter_key = filter_descriptor["key"]
        if user_filters and filter_key in user_filters:
            filter_value = user_filters[filter_key]
            if not isinstance(filter_value, dict) and filter_descriptor.get(
                "api_param"
            ):
                params[filter_descriptor["api_param"]] = filter_value

    # Extensibility: support request body for POST/PUT if needed
    body = source_dict.get("body")

    return BuiltRequest(
        url=url,
        method=method,
        params=params,
        headers=headers,
        data=body,
    )
