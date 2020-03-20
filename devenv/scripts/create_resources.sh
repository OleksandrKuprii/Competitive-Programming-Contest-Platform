#!/bin/sh
aws sqs create-queue\
    --queue-name submissions\
    --endpoint-url=$SQS_ENDPOINT

aws sqs create-queue\
    --queue-name results\
    --endpoint-url=$SQS_ENDPOINT

aws s3 mb s3://submissions\
    --endpoint-url=$S3_ENDPOINT

aws s3 mb s3://tests\
    --endpoint-url=$S3_ENDPOINT