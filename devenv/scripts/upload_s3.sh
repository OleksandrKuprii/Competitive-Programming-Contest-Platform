#!/bin/sh
set -e

for filename in devenv/s3/tests/*; do
    [ -e "$filename" ] || continue

    base=$(basename $filename)
    
    aws s3 cp "devenv/s3/tests/$base" "s3://tests/$base" --endpoint-url=http://localhost:4572
done

for filename in devenv/s3/submissions/*; do
    [ -e "$filename" ] || continue

    base=$(basename $filename)
    
    aws s3 cp "devenv/s3/submissions/$base" "s3://submissions/$base" --endpoint-url=http://localhost:4572
done