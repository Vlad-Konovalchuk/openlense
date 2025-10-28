from typing import Optional, List, Literal
from pydantic import BaseModel


# ---- QueryParamDescriptor ----
class QueryParamDescriptor(BaseModel):
    key: str
    type: Literal["string", "number", "boolean", "select"]
    label: Optional[str] = None
    default: Optional[str] = None
    required: bool = False
    user_editable: bool = True
    hidden: bool = False
    options: Optional[List[str]] = None
    api_param: Optional[str] = None


# ---- FilterDescriptor ----
class FilterDescriptor(BaseModel):
    key: str
    # path: Optional[str] = None
    type: Literal["string", "number", "boolean", "select"]
    label: Optional[str] = None
    filterable: bool = True
    options: Optional[List[str]] = None
