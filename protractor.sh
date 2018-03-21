#!/bin/bash

source "./lib/util/text.sh"
source "./lib/log/output.sh"
source "./lib/log/output_additions.sh"

proto=$(echo "$CONSOLE_URL" | grep :// | sed -e 's,^\(.*://\).*,\1,g')
url="${CONSOLE_URL/$proto/}"
host_with_port=$(echo "$url" | sed 's/\/.*$//')
host=$(echo "$host_with_port" | sed 's/:.*$//')
port=$(echo "$host_with_port" | grep : | sed -e 's,^.*:,:,g' -e 's,.*:\([0-9]*\).*,\1,g')

os::log::info "Getting certificate for ${CONSOLE_URL}"
timeout 30 google-chrome --no-sandbox --headless --disable-gpu --dump-dom "$CONSOLE_URL" &>/dev/null
echo 'GET /' | timeout 30 openssl s_client -showcerts -connect "$host:$port" | openssl x509 -outform PEM > /tmp/console-e2e.pem
os::log::info "Storing obtained certificate"
certutil -d "sql:$HOME/.pki/nssdb" -A -n console -t Pu,, -i /tmp/console-e2e.pem

os::log::info "Launching protractor tests"

failed=1
if protractor $@; then
  failed=0
fi
os::log::info "Uploading smoke test screenshot"
SCREENSHOT_URL=$(curl --upload-file /protractor/test_reports/screenshots/chrome/'Openshift login page oauth flow should login and redirect to the catalog page.png' https://transfer.sh/os_smoke_tests.png)

os::log::info "Uploading smoke test report"
REPORT_URL=$(curl --upload-file /protractor/test_reports/screenshots/protractor-e2e-report.html https://transfer.sh/protractor-e2e-report.html)

os::log::info "Please visit ${SCREENSHOT_URL} to see the screenshot of the test"
os::log::info "Please visit ${REPORT_URL} to see the report of the test"

exit $failed