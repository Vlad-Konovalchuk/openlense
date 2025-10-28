from src.types import QueryParamDescriptor, FilterDescriptor
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime, func, JSON
from datetime import datetime
from typing import Optional, Dict, Any, List, Literal
from uuid import uuid4, UUID


class Source(SQLModel, table=True):
    __tablename__ = "sources"
    name: str
    endpoint: str
    method: str
    # description: str
    mapping: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    api_filters: Optional[List[QueryParamDescriptor]] = Field(
        default_factory=list, sa_column=Column(JSON)
    )
    backend_filters: Optional[List[FilterDescriptor]] = Field(
        default_factory=list, sa_column=Column(JSON)
    )
    is_active: bool = Field(default=True)
    auth_required: bool = Field(default=False)
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=True
        )
    )
    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    )
