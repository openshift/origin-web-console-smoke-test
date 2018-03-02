#!/bin/bash

set -e

source "$(dirname "${BASH_SOURCE}")/hack/lib/init.sh"

os::log::info "Origin Web Console Smoke Test"

if [ -z "$CONSOLE_URL" ]; then
  os::log::fatal "The environment variable CONSOLE_URL must be set."
  exit 1
else
  os::log::info "The CONSOLE_URL is to $CONSOLE_URL"
fi

os::log::info "init Xvfb and run it in the background"

export DISPLAY=:99
Xvfb :99 -shmem -screen 0 1366x768x16 &

os::log::info "Give Xvfb time to start"
sleep 3

os::log::info "Update webdriver-manager"
#$(yarn bin)/webdriver-manager update

os::log::info "Run Protractor tests"
# doesn't seem to pass along the env vars otherwise
# $(yarn bin)/protractor protractor.conf.js
# is this n00b?
$(CONSOLE_URL="${CONSOLE_URL}" \
  CONSOLE_USER=${CONSOLE_USER} \
  CONSOLE_PASSWORD=${CONSOLE_PASSWORD} \
  /opt/origin-smoke-test/node_modules/protractor/bin/protractor protractor.conf.js)
  # $(yarn bin)/protractor protractor.conf.js)

os::log::info "Test Complete, exit code: $?"
