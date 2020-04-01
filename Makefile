
all:
	exit

.PHONY: devenv coreservices runner

devenv:
	docker-compose rm -f localstack
	docker-compose up -d
	(./devenv/scripts/load_devenv; ./devenv/scripts/setup_database.sh; ./devenv/scripts/create_resources.sh; ./devenv/scripts/upload_s3.sh)

coreservices:
	./devenv/scripts/run.sh coreservices

runner:
	./devenv/scripts/run.sh runner
