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
  -e CONSOLE_URL=${CONSOLE_URL}  \
  openshift-web-console-smoke-test
