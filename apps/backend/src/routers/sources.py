from fastapi import APIRouter, HTTPException, status, Depends
from typing import Annotated
from uuid import UUID
from src.services.sources import SourceService
from src.models.sources import SourceResponse, SourceCreate, SourceUpdate

router = APIRouter(prefix="/sources", tags=["Sources"])


@router.get(
    "/",
    response_model=list[SourceResponse],
    status_code=status.HTTP_200_OK,
    description="""
    Retrieve a list of all configured data sources.
    
    **Response:**
    Returns an array of source configurations, each including endpoint, filters, mapping, and metadata.
    
    **Example Response:**
    ```json
    [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "CoinAPI",
        "endpoint": "https://api.coinapi.io/v1/assets",
        "method": "GET",
        "is_active": true,
        "auth_required": false,
        "created_at": "2025-10-07T12:00:00Z",
        "updated_at": "2025-10-08T15:30:00Z"
      }
    ]
    ```
    """,
    summary="List All Sources",
    responses={
        200: {
            "description": "List of all sources",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "id": "123e4567-e89b-12d3-a456-426614174000",
                            "name": "CoinAPI",
                            "endpoint": "https://api.coinapi.io/v1/assets",
                            "method": "GET",
                            "is_active": True,
                            "auth_required": False,
                            "created_at": "2025-10-07T12:00:00Z",
                            "updated_at": "2025-10-08T15:30:00Z",
                        }
                    ]
                }
            },
        }
    },
)
async def list_sources(service: Annotated[SourceService, Depends(SourceService)]):
    return await service.get_sources()


@router.get(
    "/{source_id}",
    response_model=SourceResponse,
    status_code=status.HTTP_200_OK,
    description="""
    Retrieve a single data source configuration by its unique ID.
    
    **Response:**
    Returns the full configuration for the requested source, including endpoint, filters, mapping, and metadata.
    
    **Example Response:**
    ```json
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "CoinAPI",
      "endpoint": "https://api.coinapi.io/v1/assets",
      "method": "GET",
      "is_active": true,
      "auth_required": false,
      "created_at": "2025-10-07T12:00:00Z",
      "updated_at": "2025-10-08T15:30:00Z"
    }
    ```
    """,
    summary="Get Source by ID",
    responses={
        200: {
            "description": "Source found",
            "content": {
                "application/json": {
                    "example": {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "name": "CoinAPI",
                        "endpoint": "https://api.coinapi.io/v1/assets",
                        "method": "GET",
                        "is_active": True,
                        "auth_required": False,
                        "created_at": "2025-10-07T12:00:00Z",
                        "updated_at": "2025-10-08T15:30:00Z",
                    }
                }
            },
        },
        404: {"description": "Source not found"},
    },
)
async def get_source(
    source_id: UUID, service: Annotated[SourceService, Depends(SourceService)]
):
    source = await service.get_source_by_id(source_id)
    if not source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Source not found"
        )
    return source


@router.post(
    "/",
    response_model=SourceResponse,
    status_code=status.HTTP_201_CREATED,
    description="""
    Create a new data source configuration.
    
    **Request:**
    Provide all required fields for the source, including endpoint, method, filters, and mapping.
    
    **Example Request:**
    ```json
    {
      "name": "CoinAPI",
      "endpoint": "https://api.coinapi.io/v1/assets",
      "method": "GET",
      "mapping": {"id": "asset_id", "name": "name"},
      "is_active": true,
      "auth_required": false
    }
    ```
    
    **Response:**
    Returns the created source configuration with its unique ID and metadata.
    """,
    summary="Create Source",
    responses={
        201: {
            "description": "Source created",
            "content": {
                "application/json": {
                    "example": {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "name": "CoinAPI",
                        "endpoint": "https://api.coinapi.io/v1/assets",
                        "method": "GET",
                        "is_active": True,
                        "auth_required": False,
                        "created_at": "2025-10-07T12:00:00Z",
                        "updated_at": "2025-10-08T15:30:00Z",
                    }
                }
            },
        },
        422: {"description": "Validation error"},
    },
)
async def create_source(
    payload: SourceCreate,
    service: Annotated[SourceService, Depends(SourceService)],
):
    return await service.create_source(payload)


@router.patch(
    "/{source_id}",
    response_model=SourceResponse,
    status_code=status.HTTP_200_OK,
    description="""
    Update an existing data source configuration (partial update).
    
    **PATCH Semantics:**
    - Only provided fields will be updated
    - Omitted fields remain unchanged
    - Null values are ignored
    
    **Example Request:**
    ```json
    {
        "name": "Updated CoinAPI",
        "is_active": false
    }
    ```
    This will only update the name and is_active fields, leaving all other fields unchanged.
    """,
    summary="Update Source (Partial)",
    responses={
        200: {
            "description": "Source successfully updated",
            "content": {
                "application/json": {
                    "example": {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "name": "Updated CoinAPI",
                        "endpoint": "https://api.coinapi.io/v1/assets",
                        "method": "GET",
                        "is_active": False,
                        "created_at": "2025-10-07T12:00:00Z",
                        "updated_at": "2025-10-08T15:30:00Z",
                    }
                }
            },
        },
        404: {"description": "Source not found"},
        422: {"description": "Validation error"},
    },
)
async def update_source(
    source_id: UUID,
    payload: SourceUpdate,
    service: Annotated[SourceService, Depends(SourceService)],
):
    """
    Update a data source configuration using PATCH semantics.

    This endpoint follows REST best practices:
    - Uses PATCH method for partial updates
    - Returns 404 if source doesn't exist
    - Returns the complete updated resource
    - Validates input using Pydantic models
    """
    updated_source = await service.update_source(source_id, payload)
    if not updated_source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Source with id {source_id} not found",
        )
    return updated_source
