#!/bin/bash
set -o errexit
set -o nounset
set -o pipefail

CONTAINER_NAME=${CONTAINER_NAME:-web-console-smoke-test}
TAG=${TAG:-latest}

echo "building ${CONTAINER_NAME}:${TAG}"

docker build -t "${CONTAINER_NAME}:${TAG}" "${PWD}"
