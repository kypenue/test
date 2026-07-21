""" Services to interact with addresses. """
from dadata import Dadata

from backlib.utils import only_russian_letters
from config import ConfigEnv
from cuply.addresses.constants import ALLOWED_COUNTRIES
from cuply.addresses.schemas import (
    AddressSuggestionResponseSchema,
    AddressSuggestionRequestSchema,
    CountrySuggestionRequestSchema,
)
from cuply.auth.models import UserModel
from logs import cuply_logger


class AddressService:
    """ Service to interact with addresses. """
    def __init__(self):
        self.dadata = Dadata(ConfigEnv.DADATA_API_KEY)

    async def suggest_address(
        self,
        schema: AddressSuggestionRequestSchema,
        user: UserModel
    ) -> AddressSuggestionResponseSchema:
        """ Get addresses suggestions. """
        if schema.country:
            query = f"{schema.country} {schema.city_prefix}"
        else:
            query = f"{schema.city_prefix}"

        cuply_logger.info(f"Getting addresses suggestion for user '{user.id}' for addresses '{query}'")

        results = self.dadata.suggest(
            "address",
            query,
            count=15,
            to_bound={"value": "city"},
            locations=[{"country": "*"}]
        )

        countries = set()
        cities = set()
        for item in results:
            data = item["data"]
            country = data["country"]
            city = data["city"]
            if (
                country is not None and only_russian_letters(country) and
                city is not None and only_russian_letters(city)
            ):
                countries.add(country)
                cities.add(city)

        cuply_logger.info(f"user_id: '{user.id}', countries: '{countries}', cities: '{cities}'")

        return AddressSuggestionResponseSchema(cities=cities, countries=countries)

    async def suggest_country(self, schema: CountrySuggestionRequestSchema):
        """ Get country suggestions. """
        country_prefix = schema.country_prefix.lower()
        variants = set()

        for item in ALLOWED_COUNTRIES:
            if country_prefix in item.lower():
                variants.add(item)

        return AddressSuggestionResponseSchema(countries=set(variants), cities=set())
