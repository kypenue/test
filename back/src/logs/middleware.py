import time
from uuid import uuid4

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from logs.logger import cuply_logger


class CuplyLogMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        request_id: str = str(uuid4())
        start_time = time.time()
        response: Response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        response.headers["X-API-Request-ID"] = request_id
        cuply_logger.info(
            {
                "request_id": request_id,
                "status_code": response.status_code,
                "service": str(request.url),
                "method": request.method,
                "time": f"{process_time:.4f}s"
            }
        )
        return response
