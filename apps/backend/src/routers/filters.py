from fastapi import APIRouter, status
from src.utils.filtering_engine import (
    supported_operators_for_field_type,
    ALLOWED_OPERATORS_BY_TYPE,
)

router = APIRouter(prefix="/filters", tags=["Filters"])


@router.get(
    "/operators-catalog",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    description="Get all field types and their supported filter operators for admin UI.",
    summary="List All Supported Filter Operators by Field Type",
)
async def get_all_supported_filter_operators():
    """
    Returns a dict mapping field_type to list of supported operator descriptors.
    Example: {"string": [{id, label}, ...], "number": [...], ...}
    """
    return {
        field_type: supported_operators_for_field_type(field_type)
        for field_type in ALLOWED_OPERATORS_BY_TYPE.keys()
    }
