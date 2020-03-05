#!/bin/bash
aws sqs create-queue\
    --queue-name submissions\
    --endpoint-url=http://localhost:4576