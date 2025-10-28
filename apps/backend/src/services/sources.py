from typing import List, Optional
from sqlmodel import select
from uuid import UUID
from src.db.database import SessionDep
from src.models.sources import SourceCreate, SourceResponse, SourceUpdate
from src.db.sources import Source


class SourceService:
    def __init__(self, session: SessionDep):
        self.session = session

    async def get_sources(self) -> List[SourceResponse]:
        query = await self.session.execute(select(Source))
        rows = query.scalars().all()
        return [
            SourceResponse(
                id=r.id,
                name=r.name,
                # description=r.description,
                endpoint=r.endpoint,
                method=r.method,
                backend_filters=r.backend_filters or [],
                api_filters=r.api_filters or [],
                mapping=r.mapping or {},
                created_at=r.created_at,
                updated_at=r.updated_at,
                is_active=r.is_active,
                auth_required=r.auth_required,
            )
            for r in rows
        ]

    async def get_source_by_id(self, source_id: UUID) -> Optional[SourceResponse]:
        print(f"Fetching source by id: {source_id}")
        source = await self.session.get(Source, source_id)
        if not source:
            return None
        return SourceResponse(
            id=source.id,
            name=source.name,
            # description=source.description,
            endpoint=source.endpoint,
            method=source.method,
            backend_filters=source.backend_filters or [],
            api_filters=source.api_filters or [],
            mapping=source.mapping or {},
            created_at=source.created_at,
            updated_at=source.updated_at,
            is_active=source.is_active,
            auth_required=source.auth_required,
        )

    async def create_source(self, payload: SourceCreate) -> SourceResponse:
        new_source = Source(**payload.model_dump())
        self.session.add(new_source)
        await self.session.commit()
        await self.session.refresh(new_source)
        print(f"Data is: {new_source}")
        return SourceResponse(
            id=new_source.id,
            name=new_source.name,
            # description=new_source.description,
            endpoint=new_source.endpoint,
            method=new_source.method,
            backend_filters=new_source.backend_filters or [],
            api_filters=new_source.api_filters or [],
            mapping=new_source.mapping or {},
            created_at=new_source.created_at,
            is_active=new_source.is_active,
            auth_required=new_source.auth_required,
        )

    async def update_source(
        self, source_id: UUID, payload: SourceUpdate
    ) -> Optional[SourceResponse]:
        """
        Update an existing source with partial data (PATCH semantics).
        Only updates fields that are explicitly provided (not None).

        Args:
            source_id: UUID of the source to update
            payload: SourceUpdate model with fields to update

        Returns:
            Updated SourceResponse or None if source not found
        """
        # Fetch the existing source
        source = await self.session.get(Source, source_id)
        if not source:
            return None

        # Update only the fields that are provided (not None)
        update_data = payload.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(source, field, value)

        # Commit changes
        self.session.add(source)
        await self.session.commit()
        await self.session.refresh(source)

        # Return updated source
        return SourceResponse(
            id=source.id,
            name=source.name,
            endpoint=source.endpoint,
            method=source.method,
            backend_filters=source.backend_filters or [],
            api_filters=source.api_filters or [],
            mapping=source.mapping or {},
            created_at=source.created_at,
            updated_at=source.updated_at,
            is_active=source.is_active,
            auth_required=source.auth_required,
        )
