""" Exceptions for Telegram services. """


class BaseTelegramVerificationError(Exception):
    """ Base exceptions for Telegram services. """


class TokenNotFoundError(BaseTelegramVerificationError):
    """ Exception raised when token is not found. """


class UserNotFoundError(BaseTelegramVerificationError):
    """ Exception raised when user is not found. """


class AnotherUsernameError(BaseTelegramVerificationError):
    """ Exception raised when username is different from specified. """
    def __init__(self, specified_username: str, receiver_username: str):
        self.specified_username = specified_username
        self.receiver_username = receiver_username


class TokenAlreadyUsedError(BaseTelegramVerificationError):
    """ Exception raised when token is already used. """


class TokenExpiredError(BaseTelegramVerificationError):
    """ Exception raised when token is expired. """


class UserWithThisAccountAlreadyExists(BaseTelegramVerificationError):
    """ Exception raised when user with this account already exists. """
