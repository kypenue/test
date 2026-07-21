class BaseSEStageException(BaseException):
    """ Base exceptions for all single elimination stage exceptions. """


class SERoundCannotBeStartedException(BaseSEStageException):
    """ Exception raised when a round cannot be started. """


class SERoundCannotBeEndedException(BaseSEStageException):
    """ Exception raised when a round cannot be ended. """


class NotAllSeriesPlayedSEException(SERoundCannotBeEndedException):
    """ Exception raised when a round cannot be ended because not all series are played. """


class SERoundDrawException(BaseSEStageException):
    """ Base exceptions for drawing rounds in single elimination stage. """


class SERoundCannotBeDrawnException(BaseSEStageException):
    """ Exception raised when a round cannot be drawn. """
