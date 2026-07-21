class ForecastCompetitionBaseException(Exception):
    pass


class CannotBetForecastSeriesAlreadyPlayed(ForecastCompetitionBaseException):
    ...


class ForecastCompetitionIsNotAllowed(ForecastCompetitionBaseException):
    ...


class ForecastBetOfOtherUserCannotBeChanged(ForecastCompetitionBaseException):
    ...


class ForecastForSeriesAlreadyExists(ForecastCompetitionBaseException):
    ...
