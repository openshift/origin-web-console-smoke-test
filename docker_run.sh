#!/bin/bash

#set -o errexit
#set -o nounset
#set -o pipefail

CONTAINER_NAME=${CONTAINER_NAME:-web-console-smoke-test}
TAG=${TAG:-latest}

CERTS_PATH="${PWD}/tls/"

if [ -z "$CONSOLE_URL" ]; then
  echo "The environment variable CONSOLE_URL must be set."
  exit 1
else
  echo "The CONSOLE_URL is to $CONSOLE_URL"
fi

if [ -z "$(ls -A ${CERTS_PATH})" ]; then
  echo "The path ${CERTS_PATH} must contain your certs. Run ./make_cert.sh."
  exit 1
fi

# NOTE: token may have been passed as a string or
# have been read from disk.
docker run -it --rm \
  --mount src=${PWD}/tls/,target=/etc/tls-certs,readonly,type=bind \
  -e CONSOLE_URL=${CONSOLE_URL}  \
  -e CONSOLE_USER=${CONSOLE_USER} \
  -e CONSOLE_PASSWORD=${CONSOLE_PASSWORD} \
  -e TOKEN=${TOKEN} \
  -e KEY_PATH=${KEY_PATH} \
  -e CRT_PATH=${CRT_PATH} \
  "${CONTAINER_NAME}:${TAG}"
