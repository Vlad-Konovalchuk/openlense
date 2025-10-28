from fastapi import APIRouter, status, Depends, HTTPException
from typing import Annotated
from src.models.search import SearchRequest, SearchResponse
from src.services.sources import SourceService
from src.services.search import SearchService
from uuid import UUID
import traceback

router = APIRouter(prefix="/search", tags=["Search"])


@router.post(
    "/{source_id}",
    response_model=SearchResponse,
    status_code=status.HTTP_200_OK,
    description="""
    Search items from a configured external data source with flexible filtering.
    
    **Filter Types:**
    - **default_filters**: Applied on the backend after fetching data. Supports complex operations:
        - `eq`, `neq`: Exact match or not equal
        - `gt`, `gte`, `lt`, `lte`: Numeric comparisons
        - `contains`: Text search (case-insensitive, supports multiple patterns)
    - **api_filters**: Forwarded to the external API as query parameters. Only primitive values are sent.
    
    **Example Request:**
    ```json
    {
        "filters": {
            "default_filters": {
                "name": {"contains": ["bitcoin", "eth"]},
                "price": {"gte": 1000, "lte": 50000}
            },
            "api_filters": {
                "symbol": "BTC",
                "limit": 100
            }
        }
    }
    ```
    
    **Response:**
    Returns unified items with standard fields (id, name, url, price) plus raw data from the source.
    """,
    summary="Search Items from Source",
    responses={
        200: {
            "description": "Successful search with unified results",
            "content": {
                "application/json": {
                    "example": {
                        "results": [
                            {
                                "id": "1",
                                "name": "Bitcoin",
                                "url": "https://example.com/bitcoin",
                                "price": 45000.50,
                                "raw": {"symbol": "BTC", "market_cap": 850000000000},
                            }
                        ]
                    }
                }
            },
        },
        400: {"description": "Invalid source ID"},
        500: {"description": "Internal server error during search"},
    },
)
async def search_source(
    source_id: UUID,
    payload: SearchRequest,
    sourceService: Annotated[SourceService, Depends(SourceService)],
    # searchService=Depends(SearchService),
):
    try:

        source = await sourceService.get_source_by_id(source_id)

        if source is None:
            raise HTTPException(status_code=400, detail="Invalid source ID")

        searchService = SearchService(source)
        default_filters = (
            payload.filters.default_filters if payload and payload.filters else {}
        )
        api_filters = payload.filters.api_filters if payload and payload.filters else {}
        results = await searchService.fetch_and_process(default_filters, api_filters)
        return SearchResponse(results=results)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(traceback.format_exc())
        print(f"Error during search: {e}")
        # Catch any other unexpected exceptions
        raise HTTPException(status_code=500, detail="Internal server error")
