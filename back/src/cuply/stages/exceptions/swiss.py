class BaseSwissStageException(BaseException):
    """ Base exceptions for all swiss stage exceptions. """


class SwissRoundCannotBeStartedException(BaseSwissStageException):
    """ Exception raised when a round cannot be started. """


class SwissRoundCannotBeEndedException(BaseSwissStageException):
    """ Exception raised when a round cannot be ended. """


class NotAllSwissSeriesPlayedException(SwissRoundCannotBeEndedException):
    """ Exception raised when a round cannot be ended because not all series are played. """


class MissingFieldsSwissStageException(BaseSwissStageException):
    """ Exception raised when fields are missing in swiss stage. """


class SwissStageAlreadyStartedException(BaseSwissStageException):
    """ Exception raised when a stage is already started. """


class SwissRoundDrawException(BaseSwissStageException):
    """ Base exceptions for drawing rounds in swiss stage. """


class SwissRoundCannotBeDrawnException(BaseSwissStageException):
    """ Exception raised when a round cannot be drawn. """
