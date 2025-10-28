from typing import AsyncGenerator, Annotated
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from fastapi import Depends
from src.core.config import settings
from .sources import Source

connect_args = (
    {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
)
# Expect DATABASE_URL like: postgresql+asyncpg://user:password@db:5432/aggregator
async_engine = create_async_engine(
    settings.database_url, echo=settings.debug, future=True, connect_args=connect_args
)

AsyncSessionLocal = sessionmaker(
    async_engine, class_=AsyncSession, expire_on_commit=False
)


async def init_db() -> None:
    """
    Create DB tables (run at startup).
    Uses run_sync to call SQLModel.metadata.create_all (sync function) in async context.
    """
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


# Annotated dependency for cleaner type hints in endpoints/services
SessionDep = Annotated[AsyncSession, Depends(get_session)]
