import re


def has_number(input_text: str):
    return any(char.isdigit() for char in input_text)


def has_character(input_text: str):
    return any(char.isalpha() for char in input_text)


def only_russian_letters(text: str):
    return bool(re.fullmatch("[ \\-а-яА-ЯёЁ']+", text))
