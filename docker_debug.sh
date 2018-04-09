#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

echo "Run the following:"
echo "$ CONSOLE_URL=<url> protractor protractor.conf.js"

docker run -it --rm \
  -e CONSOLE_URL=${CONSOLE_URL} \
  --entrypoint /bin/bash origin-web-console-smoke-test
