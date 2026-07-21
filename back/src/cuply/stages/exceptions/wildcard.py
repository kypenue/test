class BaseWildcardStageException(BaseException):
    """ Base exceptions for all wildcard stage exceptions. """


class WildcardRoundCannotBeStartedException(BaseWildcardStageException):
    """ Exception raised when a round cannot be started. """


class WildcardRoundCannotBeEndedException(BaseWildcardStageException):
    """ Exception raised when a round cannot be ended. """


class NotAllWildcardSeriesPlayedException(WildcardRoundCannotBeEndedException):
    """ Exception raised when a round cannot be ended because not all series are played. """
