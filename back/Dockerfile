FROM python:3.12-alpine3.20

RUN apk add --no-cache build-base gcc musl-dev libffi-dev openssl-dev

RUN mkdir /fastapi_cuply

WORKDIR /fastapi_cuply

COPY ./etc/backend/requirements.txt .

RUN pip install -r requirements.txt

COPY ./src .

# RUN alembic upgrade head

COPY ./etc/backend/gunicorn.conf.py /etc/gunicorn.conf.py

CMD gunicorn -c /etc/gunicorn.conf.py
