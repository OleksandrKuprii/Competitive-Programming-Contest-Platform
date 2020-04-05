#!/bin/sh
set -e

aws s3 cp "devenv/s3/tests/" "s3://tests/" --recursive --endpoint-url=$S3_ENDPOINT