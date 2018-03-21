#!/bin/bash

source "$(dirname "${BASH_SOURCE}")/hack/lib/init.sh"


os::log::info "Origin Web Console Smoke Test: run_2.sh"


xvfb-run $(yarn bin)/protractor --troubleshoot ./protractor.conf.js
