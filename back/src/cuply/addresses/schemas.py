""" Schemas to interact with addresses. """
from typing import Set, Optional

from pydantic import BaseModel, ConfigDict


class AddressSuggestionRequestSchema(BaseModel):
    """ Request schema for addresses suggestions. """
    country: Optional[str] = None
    city_prefix: str


class AddressSuggestionResponseSchema(BaseModel):
    """ Response schema for addresses suggestions. """
    countries: Set[str]
    cities: Set[str]

    model_config = ConfigDict(from_attributes=True)


class CountrySuggestionRequestSchema(BaseModel):
    """ Request schema for country suggestions. """
    country_prefix: str
