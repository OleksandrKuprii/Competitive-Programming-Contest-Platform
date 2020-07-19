#!/bin/bash

. ./venv/bin/activate

docker-compose up -d

cd devenv/scripts
. ./load_devenv

# Ugh... 5 seconds sometimes don't work
sleep 10

./setup.sh

cd ../..

SERVICES=(api runner)

for SERVICE in ${SERVICES[@]}; do
  tmux new-window -n $SERVICE -t ide: "./startService.sh $SERVICE; bash"
done
