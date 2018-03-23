#!/bin/bash

#set -o errexit
#set -o nounset
#set -o pipefail

if [ -z "$CONSOLE_URL" ]; then
  echo "The environment variable CONSOLE_URL must be set."
  exit 1
else
  echo "The CONSOLE_URL is to $CONSOLE_URL"
fi

docker run -it --rm \
  --shm-size 2g -v $(pwd)/test:/protractor \
  -e CONSOLE_URL=${CONSOLE_URL}  \
  protractor-smoke-test
