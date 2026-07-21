from fastapi import Response


class OctetStreamRs(Response):
    media_type = "application/octet-stream"


class MultipartFormDataRs(Response):
    media_type = "multipart/form-data"
