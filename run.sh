#!/bin/bash

set -e

#source "$(dirname "${BASH_SOURCE}")/hack/lib/init.sh"

#os::log::info "Origin Web Console Smoke Test"
echo "Origin Web Console Smoke Test"

COUNTER=1

while true
do
  # os::log::info  "Running Test: $COUNTER"
  echo "Running Test: $COUNTER"
  # $($(npm bin)/webdriver-manager update)
  ./node_modules/.bin/webdriver-manager update

  $(CONSOLE_PUBLIC_URL="https://192.168.1.69:8443" \
    CONSOLE_USER_NAME=bob \
    CONSOLE_PASSWORD=bob \
    yarn run webdriver:update \
    ./node_modules/.bin/protractor protractor.conf.js)

  # os::log::info  "Test Complete, exit code:" $?
  echo "Test Complete, exit code: ?"
  COUNTER=$[$COUNTER +1]
  sleep 25
done
