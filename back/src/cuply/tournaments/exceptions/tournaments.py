""" Exceptions for tournament services. """


class BaseTournamentException(Exception):
    """ Base exceptions for all tournament services exceptions. """


class TournamentNotStartedYetException(BaseTournamentException):
    """ Exception raised when a tournament is not started yet. """


class CannotStartTournamentException(BaseTournamentException):
    """ Exception raised when a tournament cannot be started. """
