#!/bin/sh
set -e

aws s3 cp "devenv/s3/tests/" "s3://tests/" --recursive --endpoint-url=$S3_ENDPOINT

aws s3 cp "devenv/s3/submissions/" "s3://submissions/" --recursive --endpoint-url=$S3_ENDPOINT