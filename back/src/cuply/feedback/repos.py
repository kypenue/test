from backlib.repos import BaseAsyncRepo
from cuply.feedback.models import FeedbackModel


class FeedbackAsyncRepo(BaseAsyncRepo):
    model = FeedbackModel
