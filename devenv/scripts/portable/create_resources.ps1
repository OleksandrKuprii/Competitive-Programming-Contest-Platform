aws sqs create-queue --queue-name submissions --endpoint-url="http://localhost:4576"
aws s3 mb s3://submissions --endpoint-url="http://localhost:4572"
aws s3 mb s3://tests --endpoint-url="http://localhost:4572"
