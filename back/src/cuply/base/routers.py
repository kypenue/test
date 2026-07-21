from fastapi import APIRouter, HTTPException

from cuply.base.services.caching.cache import Cache

router = APIRouter(
    prefix="/base",
    tags=["Base"],
)

@router.get("/personal-data-policy", response_model=dict)
async def get_personal_data_policy():
    """
    Возвращает значение для ключа 'personal-data-policy'.
    """
    value = await Cache.get("personal-data-policy")
    if value is None:
        raise HTTPException(status_code=404, detail="Personal Data Policy not found")
    return {"key": "personal-data-policy", "value": value}



@router.get("/cookie-policy", response_model=dict)
async def get_cookie_policy():
    """
    Возвращает значение для ключа 'cookie-policy'.
    """
    value = await Cache.get("cookie-policy")
    if value is None:
        raise HTTPException(status_code=404, detail="Cookie Policy not found")
    return {"key": "cookie-policy", "value": value}
