"""Procuction env"""
import aioboto3

postgres_host = "localhost"
postgres_user = "postgres"
postgres_password = "postgres"
postgres_db = "toucan"

submissions_queue_url = "https://sqs.eu-central-1.amazonaws.com/482075578518/toucansubmissions"

submissions_bucket = "toucansubmissions"
tests_bucket = "toucantests"
tasks_bucket = "toucantasks"

storage_root = "../_storage"


def resource(res):
    """Abstracts aioboto3 resource to hide endpoint_url"""
    return aioboto3.resource(res)
