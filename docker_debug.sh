#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

echo "Run the following:"
echo "$ CONSOLE_URL=<url> protractor protractor.conf.js"

docker run -it --privileged --rm \
  --shm-size 2g -v $(pwd)/test:/protractor \
  -e CONSOLE_URL=${CONSOLE_URL} \
  --entrypoint /bin/bash protractor-smoke-test
