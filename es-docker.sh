#!/bin/bash

# run this file to get a working ES instance
# for running the test locally

exec docker run \
  --rm \
  -e "discovery.type=single-node" \
  -e "DISABLE_SECURITY_PLUGIN=true" \
  -p 9200:9200 \
  docker.io/opensearchproject/opensearch:2.13.0
