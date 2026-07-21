class BaseDEStageException(BaseException):
    """ Base exceptions for all double elimination stage exceptions. """


class DERoundCannotBeStartedException(BaseDEStageException):
    """ Exception raised when a round cannot be started. """


class DERoundCannotBeEndedException(BaseDEStageException):
    """ Exception raised when a round cannot be ended. """


class NotAllSeriesPlayedDEException(DERoundCannotBeEndedException):
    """ Exception raised when a round cannot be ended because not all series are played. """


class DERoundDrawException(BaseDEStageException):
    """ Base exceptions for drawing rounds in double elimination stage. """


class DERoundCannotBeDrawnException(BaseDEStageException):
    """ Exception raised when a round cannot be drawn. """
