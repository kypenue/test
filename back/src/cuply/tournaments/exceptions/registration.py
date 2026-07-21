""" Exceptions for tournament registration services. """


class BaseRegistrationError(Exception):
    """ Base exceptions for tournament services. """


class AgeLimitRegistrationError(BaseRegistrationError):
    """ Exception raised when user does not fit age limits. """


class UserBlockedRegistrationError(BaseRegistrationError):
    """ Exception raised when user is blocking by tournament organizer. """


class TelegramNotVerifiedRegistrationError(BaseRegistrationError):
    """ Exception raised when user telegram is not verified. """


class RegistrationNotStartedError(BaseRegistrationError):
    """ Exception raised when registration is not started. """


class RegistrationEndedError(BaseRegistrationError):
    """ Exception raised when registration is already ended. """


class TooManyParticipantsError(BaseRegistrationError):
    """ Exception raised when tournament participants are too many. """


class UserAlreadyRegisteredError(BaseRegistrationError):
    """ Exception raised when user is already registered. """


class PlatformNotFoundError(BaseRegistrationError):
    """ Exception raised when specified platform is not available in tournament. """
