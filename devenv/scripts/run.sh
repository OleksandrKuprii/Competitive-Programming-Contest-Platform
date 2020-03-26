#!/bin/sh
. devenv/scripts/load_devenv
cd backend/$1
pip install -r requirements.txt
cd ../..
python -m toucan.$1