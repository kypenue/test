""" Endpoints to get addresses suggestions. """
from fastapi import APIRouter, Depends

from cuply.addresses.schemas import (
    AddressSuggestionRequestSchema,
    AddressSuggestionResponseSchema,
    CountrySuggestionRequestSchema,
)
from cuply.addresses.services import AddressService
from cuply.auth.base_config import current_active_user
from cuply.auth.models import UserModel


router = APIRouter(
    prefix="/addresses",
    tags=["Address"],
)


address_service = AddressService()


@router.post("/city-suggestions", response_model=AddressSuggestionResponseSchema)
async def get_address_suggestion(
    address_rq: AddressSuggestionRequestSchema,
    user: UserModel = Depends(current_active_user)
) -> AddressSuggestionResponseSchema:
    """ Endpoint to get addresses suggestions. """
    return await address_service.suggest_address(address_rq, user)


@router.post("/country-suggestions", response_model=AddressSuggestionResponseSchema)
async def get_country_suggestion(
    country_rq: CountrySuggestionRequestSchema,
    user: UserModel = Depends(current_active_user)
) -> AddressSuggestionResponseSchema:
    """ Endpoint to get country suggestions. """
    return await address_service.suggest_country(country_rq)
