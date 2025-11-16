from typing import Dict, Any, List
from src.services.request_builder import build_request_from_source
from src.services.http_client import HttpClient
from src.utils.fields_mapping import extract_fields
from src.utils.filtering_engine import apply_filters
from src.utils.data import mock_response

http_client = HttpClient()


class SearchService:
    def __init__(self, source_record: Dict[str, Any]):
        """
        source_record: dict-like object (from DB or Source model) with keys:
           endpoint, method, params, headers, mapping, filters
        """
        self.source = source_record
        self.mapping = source_record.get("mapping") or {}
        self.filter_descriptors = source_record.get("backend_filters") or []

    async def fetch_raw(self, api_filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        req = build_request_from_source(source=self.source, user_filters=api_filters)
        raw = await http_client.fetch(req)

        # Handle common API response patterns:
        # 1. Direct list response
        # 2. Data wrapped in 'data' field
        # 3. Single object response
        # 4. Empty response
        return mock_response.get("data")
        if isinstance(raw, list):
            return raw
        elif isinstance(raw, dict):
            if "data" in raw and raw["data"] is not None:
                data = raw["data"]
                return data if isinstance(data, list) else [data]
            elif raw:  # Non-empty dict
                return [raw]

        return []  # Fallback for null/empty responses

    async def fetch_and_process(
        self, default_filters: Dict[str, Any], api_filters: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Fetch data from external API and apply backend filtering.

        Args:
            default_filters: Backend filters to apply after fetching (supports complex operations)
            api_filters: Filters to pass to external API as query parameters

        Returns:
            List of mapped and filtered items with unified structure
        """
        # Step 1: Fetch raw data from external API with api_filters as query params
        raw_items = await self.fetch_raw(api_filters)
        # Step 2: Apply backend filtering using default_filters on raw response data
        # This allows complex operations (gt, lt, contains) that the external API may not support
        filtered_raw = apply_filters(
            raw_items,
            self.filter_descriptors,  # Backend filter configuration from source
            default_filters or {},  # User's backend filter conditions
        )

        # Step 3: Map filtered items to unified structure using source mapping config
        mapped = [extract_fields(item, self.mapping) for item in filtered_raw]

        # Step 4: Attach raw data for reference and ensure required fields exist
        for i, item in enumerate(mapped):
            item["raw"] = filtered_raw[i]
            item["url"] = "#"  # TODO: Remove hardcoded values
            item["id"] = "id"  # TODO: Remove hardcoded values

        return mapped
