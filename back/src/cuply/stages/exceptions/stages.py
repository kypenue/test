class BaseStageException(Exception):
    ...


class StageAlreadyStartedException(BaseStageException):
    ...


class StageNotEndedException(BaseStageException):
    ...


class MissingFieldsStageException(BaseStageException):
    ...
