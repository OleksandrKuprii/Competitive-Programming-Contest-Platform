#!/bin/bash

# Exit on error
set -e

# Script directory
script_dir=$(dirname "$0")

# Helper function that returns current unix timestamp
function timestamp() {
  date +%s
}

# One argument should be passed
if [ "$#" -ne 1 ]; then
  echo '{"error":"Illegal number of arguments"}'
  exit
fi

# Local storage root
storage_root="storage"

# Dir for tests (inputs)
test_dir=$storage_root/test

# Dir for submissions (user code)
submission_dir=$storage_root/submission

# Extract variables from JSON given to script as only argument
submission_id=$(echo "$1" | jq -r '."submission_id"')
lang=$(echo "$1" | jq -r '.lang')


base_image="$lang-baseimage"

# Run base image container
container=$(buildah from --pull-never "$base_image")

# Mount container
mountpoint=$(buildah unshare buildah mount "$container")

# Create dir for submission to run
mkdir -p "$mountpoint"/usr/app

# Copy sources
cp $submission_dir/"$submission_id"/main.py "$mountpoint"/usr/app/main.py

# Umount container
buildah unshare buildah umount "$container" >/dev/null

# Create unique image name
image=$container-image-$(timestamp)

# Commit image
buildah unshare buildah commit -q $container $image >/dev/null

# Remove base container
buildah rm "$container" >/dev/null

# Runs when script ends whenever it finishes successfully or not
function cleanup() {
  # Delay command execution using at
  echo "podman image rm $image" | at now + 1 minute 2>/dev/null
}

# Trap cleanup
trap cleanup EXIT

output=()
status=()
cpu_time=()
wall_time=()

wall_time_limit="$(echo "$1" | jq -r '."limits"."wall_time"')"
cpu_time_limit="$(echo "$1" | jq -r '."limits"."cpu_time"')"

limits=("$wall_time_limit" "$cpu_time_limit")

# Runs container, returns it's id
# Takes image name
function run_container() {
  podman run --rm -d --network=none "$1" sleep 100
}

# Mounts container, returns mountpoint
# Takes container id
function mount_container() {
  podman unshare podman mount "$1"
}

# Copy input.txt to container
# Takes mountpoint and test id
function copy_test_to_container() {
  cp "$test_dir/$2/input.txt" "$1/usr/app/input.txt"
}

# Executes submission code in container
# Takes container id
function execute_submission() {
  if podman exec "$1" bash -c "cd /usr/app; (time timeout ${wall_time_limit}s python3 main.py) > /dev/null 2> /time" 2>/dev/null; then
    echo 'SS'
  else
    case $? in
    # Was actually killed by timeout
    '124')
      echo 'TL'
      ;;
    esac
  fi
}

function run_test() {
  local container
  container=$(run_container "$image")

  local mountpoint
  mountpoint=$(mount_container "$container")

  copy_test_to_container "$mountpoint" "$1"

  local local_status
  local_status=$(execute_submission "$container")

  local execution_time
  execution_time=$(awk -f "$script_dir"/parse_time.awk "$mountpoint"/time)

  local i=0

  for time in $execution_time; do
    if [ $i == 0 ]; then
      cpu_time+=("$time")
    elif [ $i == 1 ]; then
      wall_time+=("$time")
    fi

    if [ "$local_status" == 'SS' ]; then
      if (($(echo "$time > ${limits[$i]}" | bc -l))); then
        if [ $i == 0 ]; then
          local_status='TL'
        elif [ $i == 1 ]; then
          local_status='TL'
        fi

        break
      fi
    fi

    i=$(($i + 1))
  done

  status+=("$local_status")

  if [ $local_status == 'OK' ]; then
    if test -f "$FILE"; then
      output+=("$(cat "$mountpoint"/usr/app/output.txt)")
    else
      output+=(1)
    fi
  else
    output+=(0)
  fi

  podman unshare podman umount $container >/dev/null
  podman kill $container >/dev/null
}

for i in $(echo $1 | jq -r '."test_ids"[]'); do
  run_test $i
done

echo -n "["

for i in "${!output[@]}"; do
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
