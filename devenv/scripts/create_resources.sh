#!/bin/sh
set -e

python -m awscli sqs create-queue\
    --queue-name submissions\
    --endpoint-url="$SQS_ENDPOINT"

python -m awscli s3 mb s3://submissions\
    --endpoint-url="$S3_ENDPOINT"

python -m awscli s3 mb s3://tests\
    --endpoint-url="$S3_ENDPOINT"