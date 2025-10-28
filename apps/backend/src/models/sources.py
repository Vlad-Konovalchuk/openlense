from datetime import datetime
from typing import Annotated, Optional, Dict, Any, Literal, List
from uuid import UUID
from pydantic import BaseModel, StringConstraints
from src.db.schemas import ORMBaseModel
from src.types import QueryParamDescriptor, FilterDescriptor


"""
    Represents the base schema for a data source configuration.
    Includes endpoint, HTTP method, filter schema, mapping rules, and optional description.
    Example:
    {
        "name": "CoinAPI",
        "endpoint": "https://api.coinapi.io/v1/assets",
        "method": "GET",
        "filters": {"symbol": {"type": "string", "filterable": True}},
        "mapping": {"id": "asset_id", "name": "name"},
        "description": "Cryptocurrency asset data",
        "created_at": "2025-10-07T12:00:00Z"
    }
"""


class SourceBase(BaseModel):
    name: Annotated[str, StringConstraints(max_length=100)]
    endpoint: Annotated[str, StringConstraints(max_length=255)]
    method: Literal["GET", "POST"]
    api_filters: Optional[List[QueryParamDescriptor]] = None
    backend_filters: Optional[List[FilterDescriptor]] = None
    mapping: Dict[str, Any]
    # description: Optional[Annotated[str, StringConstraints(max_length=500)]] = None
    is_active: bool = True
    auth_required: bool = False


"""
    Schema for creating a new data source configuration.
    Inherits all fields from SourceBase.
"""


class SourceCreate(SourceBase):
    pass


"""
    Schema for updating an existing data source configuration.
    All fields are optional to allow partial updates (PATCH semantics).
    Only the fields provided will be updated, null values are ignored.
"""


class SourceUpdate(BaseModel):
    name: Optional[Annotated[str, StringConstraints(min_length=1, max_length=100)]] = (
        None
    )
    endpoint: Optional[
        Annotated[str, StringConstraints(min_length=1, max_length=255)]
    ] = None
    method: Optional[Literal["GET", "POST"]] = None
    api_filters: Optional[List[QueryParamDescriptor]] = None
    backend_filters: Optional[List[FilterDescriptor]] = None
    mapping: Optional[Dict[str, Any]] = None
    description: Optional[Annotated[str, StringConstraints(max_length=500)]] = None
    is_active: Optional[bool] = None
    auth_required: Optional[bool] = None


"""
    Response schema for a data source, including its unique ID and all configuration fields.
    Used for returning source data to the frontend or API consumers.
"""


class SourceResponse(ORMBaseModel):
    id: UUID
    name: Annotated[str, StringConstraints(max_length=100)]
    endpoint: Annotated[str, StringConstraints(max_length=255)]
    method: Annotated[str, StringConstraints(max_length=10)]
    api_filters: Optional[List[QueryParamDescriptor]] = None
    backend_filters: Optional[List[FilterDescriptor]] = None
    mapping: Dict[str, Any]
    description: Optional[Annotated[str, StringConstraints(max_length=500)]] = None
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    auth_required: bool = False
    updated_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
