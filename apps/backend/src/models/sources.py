from datetime import datetime
from typing import Annotated, Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, StringConstraints
from src.db.schemas import ORMBaseModel


class SourceBase(BaseModel):
    name: Annotated[str, StringConstraints(max_length=100)]
    endpoint: Annotated[str, StringConstraints(max_length=255)]
    method: Annotated[str, StringConstraints(max_length=10)]
    filters_schema: Dict[str, Any]
    mapping: Dict[str, Any]
    description: Optional[Annotated[str, StringConstraints(max_length=500)]] = None
    new_column: Optional[int] = None


class SourceCreate(SourceBase):
    pass


class SourceUpdate(BaseModel):
    name: Optional[Annotated[str, StringConstraints(max_length=100)]] = None
    endpoint: Optional[Annotated[str, StringConstraints(max_length=255)]] = None
    method: Optional[Annotated[str, StringConstraints(max_length=10)]] = None
    filters_schema: Optional[Dict[str, Any]] = None
    mapping: Optional[Dict[str, Any]] = None
    description: Optional[Annotated[str, StringConstraints(max_length=500)]] = None
    new_column: Optional[int] = None


class SourceResponse(ORMBaseModel):
    id: UUID
    name: Annotated[str, StringConstraints(max_length=100)]
    endpoint: Annotated[str, StringConstraints(max_length=255)]
    method: Annotated[str, StringConstraints(max_length=10)]
    filters_schema: Dict[str, Any]
    mapping: Dict[str, Any]
    description: Optional[Annotated[str, StringConstraints(max_length=500)]] = None
    new_column: Optional[int] = None
    created_at: datetime
