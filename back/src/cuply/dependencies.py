from typing import Annotated

from fastapi import Depends

from backlib.unit_of_work import AbstractUnitOfWork
from cuply.cuply_unit_of_work import SyncUnitOfWork, AsyncUnitOfWork

UOWDep = Annotated[AbstractUnitOfWork, Depends(SyncUnitOfWork)]

UOWDepAsync = Annotated[AbstractUnitOfWork, Depends(AsyncUnitOfWork)]
