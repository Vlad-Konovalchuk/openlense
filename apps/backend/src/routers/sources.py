from fastapi import APIRouter, HTTPException, status
from uuid import UUID
from src.services.sources import get_sources, get_source_by_id
from src.models.sources import SourceResponse

router = APIRouter(prefix="/sources", tags=["Sources"])


@router.get(
    "/",
    response_model=list[SourceResponse],
    status_code=status.HTTP_200_OK,
    description="Get all sources",
    summary="List Sources",
)
async def list_sources():
    return await get_sources()


@router.get(
    "/{source_id}",
    response_model=SourceResponse,
    status_code=status.HTTP_200_OK,
    description="Get one source",
    summary="Get source by id",
)
async def get_source(source_id: UUID):
    source = await get_source_by_id(source_id)
    if not source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Source not found"
        )
    return source
