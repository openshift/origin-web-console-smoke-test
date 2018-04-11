#!/bin/bash
set -o errexit
set -o nounset
set -o pipefail

CONTAINER_NAME=${CONTAINER_NAME:-web-console-smoke-test}
TAG=${TAG:-latest}
USERNAME=${USERNAME:-benjaminapetersen}

echo "container: ${CONTAINER_NAME}"
echo "user: ${USERNAME}"
echo "hub: ${USERNAME}/${CONTAINER_NAME}"
echo "image: ${USERNAME}/${CONTAINER_NAME}:${TAG}"
echo "tag: ${CONTAINER_NAME} ${USERNAME}/${CONTAINER_NAME}:${TAG}"
echo "working dir: ${PWD}"

docker build -t "${CONTAINER_NAME}:${TAG}" "${PWD}"
docker tag "${CONTAINER_NAME}" "${USERNAME}/${CONTAINER_NAME}:${TAG}"
docker push "${USERNAME}/${CONTAINER_NAME}:${TAG}"
