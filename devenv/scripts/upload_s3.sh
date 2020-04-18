#!/bin/sh
python -m awscli s3 cp "../s3/tests/" "s3://tests/" --recursive --endpoint-url=$S3_ENDPOINT