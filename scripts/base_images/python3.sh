#!/bin/bash

container=$(buildah from python:3.8-alpine)



buildah commit "$container" python3-baseimage
buildah rm "$container"