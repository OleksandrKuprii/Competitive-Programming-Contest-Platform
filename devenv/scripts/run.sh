#!/bin/bash
. devenv/scripts/load_devenv
cd backend/
echo $1
python -m "toucan.$1"