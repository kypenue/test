import multiprocessing

bind = "0.0.0.0:8000"
workers = 3
worker_class = "uvicorn.workers.UvicornWorker"
log_level = "info"
wsgi_app = "cuply_api:cuply_app"
max_requests = 1000
reload = True
