#!/bin/bash

. ./venv/bin/activate

docker-compose up -d

cd devenv/scripts
. ./load_devenv

sleep 5

./setup.sh

cd ../..

SERVICES=(api runner)

for SERVICE in ${SERVICES[@]}; do
  tmux new-window -n $SERVICE -t ide: "./startService.sh $SERVICE; bash"
done
