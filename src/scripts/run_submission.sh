#!/bin/bash

# Exit on error
set -e

# One argument should be passed
if [ "$#" -ne 1 ]; then
  echo '{"error":"Illegal number of arguments"}'
fi

storage_root="storage"
test_dir=$storage_root/test
submission_dir=$storage_root/submission
submission_id=$(echo $1 | jq -r '."submission_id"')
lang=$(echo $1 | jq -r '.lang')

base_image='none'

case $lang in
  'python3') base_image='python:3.8.1-slim-buster'
esac

if [ $base_image == 'none' ]; then
  echo '{"error":"Unknown lang"}'
fi

container=$(buildah from --pull-never $base_image);
mountpoint=$(buildah unshare buildah mount $container);

mkdir -p $mountpoint/usr/app
cp $submission_dir/$submission_id/main.py $mountpoint/usr/app/main.py

buildah unshare buildah umount $container > /dev/null

function timestamp() {
  date +%s
}

image=$container-image-$(timestamp)

buildah unshare buildah commit -q $container $image > /dev/null

function cleanup() {
  echo "podman image rm $image" | at now + 1 minute 2> /dev/null
}

trap cleanup EXIT

buildah rm $container > /dev/null

output=()
status=()
cpu_time=()
wall_time=()

limits=("$(echo $1 | jq -r '."limits"."wall_time"')" "$(echo $1 | jq -r '."limits"."cpu_time"')")

function run_test() {
  local container
  container="$(podman run --rm -d --network=none $image sleep 100)"

  local mountpoint
  mountpoint=$(podman unshare podman mount $container)

  cp $test_dir/$1/input.txt $mountpoint/usr/app/input.txt

  local local_status='NULL'

  if podman exec $container bash -c "cd /usr/app; (time timeout ${limits[1]}s python3 main.py) > /dev/null 2> /time" 2> /dev/null;
  then
    local_status='OK'
  else
    case $? in
      '124') local_status='TL'
      ;;
    esac
  fi

  local i=0

  for time in $(awk -f parse_time.awk $mountpoint/time)
  do
    if [ $i == 0 ]; then
      cpu_time+=("$time")
    elif [ $i == 1 ]; then
      wall_time+=("$time")
    fi

    if [ $local_status == 'OK' ]; then
      if (( $(echo "$time > ${limits[$i]}" |bc -l) )); then
        if [ $i == 0 ]; then
          local_status='TL'
        elif [ $i == 1 ]; then
          local_status='TL'
        fi

        break
      fi
    fi

    i=$(($i+1))
  done

  status+=("$local_status")

  if [ $local_status == 'OK' ]; then
    output+=("$(cat $mountpoint/usr/app/output.txt)")
  else
    output+=(0)
  fi

  podman unshare podman umount $container > /dev/null
  podman kill $container > /dev/null
}


for i in $(echo $1 | jq -r '."test_ids"[]'); do
  run_test $i
done

echo -n "["

for i in "${!output[@]}";
do
  if [ $i != 0 ]; then
    echo -n ','
  fi

  if [ ${status[$i]} == 'OK' ]; then
    echo -n "{\"status\":\"OK\",\"output\":\"${output[$i]}\""
    echo -n ",\"cpu_time\":\"${cpu_time[$i]}\",\"wall_time\":\"${wall_time[$i]}\"}"
  else
    echo -n "{\"status\":\"${status[$i]}\"}"
  fi
done

echo "]"
