#!/bin/sh
. ./load_devenv
./setup_database.sh
./create_resources.sh
./upload_s3.sh