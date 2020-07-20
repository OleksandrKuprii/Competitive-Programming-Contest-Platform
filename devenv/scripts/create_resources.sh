#!/bin/sh
set -e

aws sqs create-queue\
    --queue-name submissions\
    --endpoint-url="$LOCALSTACK_EDGE"

aws s3 mb s3://submissions\
    --endpoint-url="$LOCALSTACK_EDGE"

aws s3 mb s3://tests\
    --endpoint-url="$LOCALSTACK_EDGE"

aws s3 mb s3://tasks\
    --endpoint-url="$LOCALSTACK_EDGE"