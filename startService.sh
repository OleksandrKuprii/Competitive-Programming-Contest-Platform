#!/bin/sh

cd devenv/scripts
. ./load_devenv

cd ../../backend/toucan
python -m $1
