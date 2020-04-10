all:
	exit

.PHONY: devenv coreservices runner

devenv:
	(. ./devenv/scripts/load_devenv; ./devenv/scripts/setup_database.sh; ./devenv/scripts/create_resources.sh; ./devenv/scripts/upload_s3.sh)

api:
	./devenv/scripts/run.sh api

runner:
	./devenv/scripts/run.sh runner
