from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from src.db.schemas import ORMBaseModel


"""
    Represents a search request with dynamic filters for querying external sources.
    New structure distinguishes between default (backend) filters and API passthrough filters.
    Example:
    {
        "filters": {
            "default_filters": {
                "name": {"contains": ["bit"]},
                "price": {"gte": 100}
            },
            "api_filters": {
                # filters that should be forwarded to the external API as query params
            }
        }
    }
"""


class FiltersPayload(BaseModel):
    """
    Container for search filters with distinct purposes.

    Attributes:
        default_filters: Backend-side filters applied after fetching data.
            Supports operations: eq, neq, gt, gte, lt, lte, contains.
            Example: {"name": {"contains": ["bitcoin"]}, "price": {"gte": 1000, "lte": 5000}}

        api_filters: Filters forwarded as query parameters to the external API.
            Keys must match source.api_filters[].key configuration.
            Only primitive values (not dict operations) are sent to API.
            Example: {"symbol": "BTC", "limit": 50}
    """

    default_filters: Dict[str, Any] = Field(
        default_factory=dict,
        description="Backend filters applied after data fetch. Supports complex operations like gt, lt, contains.",
        examples=[
            {
                "name": {"contains": ["bitcoin", "eth"]},
                "price": {"gte": 1000, "lte": 50000},
                "market_cap": {"gt": 1000000},
            }
        ],
    )
    api_filters: Dict[str, Any] = Field(
        default_factory=dict,
        description="Filters passed as query parameters to external API. Must match source configuration.",
        examples=[{"symbol": "BTC", "limit": 100, "convert": "USD"}],
    )


class SearchRequest(BaseModel):
    """
    Search request payload for querying external data sources.

    The filters are split into two categories:
    - default_filters: Applied on the backend after fetching data (supports complex operations)
    - api_filters: Forwarded to the external API as query parameters

    Example request:
    ```json
    {
        "filters": {
            "default_filters": {
                "name": {"contains": ["bitcoin"]},
                "price": {"gte": 1000, "lte": 50000}
            },
            "api_filters": {
                "symbol": "BTC",
                "limit": 100
            }
        }
    }
    ```
    """

    filters: FiltersPayload = Field(
        default_factory=FiltersPayload,
        description="Filter configuration with backend and API filters",
    )


"""
    Creates unified item from search with our basic fields and all extra fields could be returned in additional_fields 
    Example of item 
    {
         "id": "123",
         "name": "Bitcoin",
         "url": "https://example.com/bitcoin",
         "price": 42000.5,
         "additional_fields": {
            "category": "cryptocurrency",
            "market_cap": 800000000000,
            "symbol": "BTC"
            }
     }
"""


class UnifiedSearchItem(BaseModel):
    """
    Unified search result item with standardized fields across all data sources.

    Attributes:
        id: Unique identifier for the item (required)
        name: Display name of the item
        url: Link to the item's detail page or resource
        price: Numeric price value if applicable
        raw: Original raw data from the source API for reference
    """

    id: str = Field(..., description="Unique identifier for the item")
    name: Optional[str] = Field(None, description="Display name of the item")
    url: Optional[str] = Field(None, description="URL to the item's page or resource")
    price: Optional[float] = Field(None, description="Price value if applicable")
    raw: Dict[str, Any] = Field(..., description="Original raw data from source API")


"""
    Represents the unified search response containing a list of normalized items from various sources.
    Each item is an instance of UnifiedSearchItem, which includes both standard and additional fields.
"""


class SearchResponse(ORMBaseModel):
    """
    Unified search response containing normalized items from various data sources.

    All items are transformed to the UnifiedSearchItem format with standard fields
    plus the original raw data for additional context.
    """

    results: List[UnifiedSearchItem] = Field(
        ..., description="List of unified search results from the queried source"
    )
