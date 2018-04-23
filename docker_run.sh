#!/bin/bash

#set -o errexit
#set -o nounset
#set -o pipefail

CONTAINER_NAME=${CONTAINER_NAME:-web-console-smoke-test}
TAG=${TAG:-latest}

CERTS_PATH="${PWD}/tls"
KEY_PATH="${CERTS_PATH}/key.pem"
CRT_PATH="${CERTS_PATH}/crt.pem"

if [ -z "$CONSOLE_URL" ]; then
  echo "The environment variable CONSOLE_URL must be set."
  exit 1
else
  echo "The CONSOLE_URL is to $CONSOLE_URL"
fi

if [ -z "$(ls -A ${CERTS_PATH})" ]; then
  echo "The path ${CERTS_PATH} must contain your certs. Run ./make_dev_cert.sh."
  echo "these files will be mounted into your container to secure the /metrics endpoint."
  exit 1
fi

if [ -z "$TOKEN" ]; then
  echo "You must provide a TOKEN for tests to access the web console."
  echo "An OAuth token is sufficient"
  exit 1
fi


# NOTE: token may have been passed as a string or
# have been read from disk.
docker run -it --rm \
  --mount src=${CERTS_PATH},target=/etc/tls-certs,readonly,type=bind \
  -e CONSOLE_URL=${CONSOLE_URL}  \
  -e CONSOLE_USER=${CONSOLE_USER} \
  -e CONSOLE_PASSWORD=${CONSOLE_PASSWORD} \
  -e TOKEN=${TOKEN} \
  -e KEY_PATH=${KEY_PATH} \
  -e CRT_PATH=${CRT_PATH} \
  "${CONTAINER_NAME}:${TAG}"
