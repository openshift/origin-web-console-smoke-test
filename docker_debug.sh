#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

CONTAINER_NAME=${CONTAINER_NAME:-web-console-smoke-test}
TAG=${TAG:-latest}

echo ""
echo "debug ${CONTAINER_NAME}:${TAG}"
echo ""
echo "-------------------------------------------------"
# once you enter the container, you will run the following
# commands to manually debug the test:
echo "To manually debug, run one of the following:"
echo "- To use the oauth flow:"
echo "  $ CONSOLE_URL=<url> protractor protractor.conf.js"
echo "- To use an oauth token and bypass the oauth flow:"
echo "  $ CONSOLE_URL=<url> TOKEN=<your-token> protractor protractor.conf.js"
echo "-------------------------------------------------"
echo ""

docker run -it --rm \
  --entrypoint /bin/bash "${CONTAINER_NAME}:${TAG}"
