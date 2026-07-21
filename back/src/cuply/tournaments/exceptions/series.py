class BracketsError(Exception):
    """ Base exceptions for all brackets exceptions, """


class NoAvailableSeriesError(BracketsError):
    """ Raised when no series are available. """
