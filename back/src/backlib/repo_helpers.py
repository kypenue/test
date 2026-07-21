from typing import Optional, Any

from fastapi import HTTPException
from starlette import status


def raise_not_found_if_none(item: Optional[Any], item_id: Any):
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Not found item with '{item_id}'"
        )
