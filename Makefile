all:
	exit

.PHONY: devenv

devenv:
	(. ./devenv/scripts/load_devenv; ./devenv/scripts/setup_database.sh; ./devenv/scripts/create_resources.sh; ./devenv/scripts/upload_s3.sh)
