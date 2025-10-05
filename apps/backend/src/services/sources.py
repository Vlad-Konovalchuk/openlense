from typing import List, Optional
from uuid import UUID
from src.models.sources import SourceCreate, SourceUpdate, SourceResponse

# Mock DB
_sources_db: List[SourceResponse] = []

async def get_sources() -> List[SourceResponse]:
    return _sources_db

async def get_source_by_id(source_id: UUID) -> Optional[SourceResponse]:
    for source in _sources_db:
        if source.id == source_id:
            return source
    return None

async def create_source(data: SourceCreate) -> SourceResponse:
    #TODO: Add DB logic here
    pass

async def update_source(source_id: UUID, data: SourceUpdate) -> Optional[SourceResponse]:
    #TODO: Add DB logic here
    pass

async def delete_source(source_id: UUID) -> bool:
    #TODO: Add DB logic here
    pass