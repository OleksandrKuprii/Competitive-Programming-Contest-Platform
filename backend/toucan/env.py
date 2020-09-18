"""Development env."""
import aioboto3

postgres_host = "localhost"
postgres_user = "postgres"
postgres_password = "postgres"
postgres_db = "toucandb"

aws_endpoint = "http://localhost:4566"
submissions_queue_url = aws_endpoint + "/queue/submissions"

submissions_bucket = "submissions"
tests_bucket = "tests"
tasks_bucket = "tasks"

storage_root = "../_storage"


def resource(res):
    """Abstracts aioboto3 resource to hide endpoint_url."""
    return aioboto3.resource(res, endpoint_url=aws_endpoint)
