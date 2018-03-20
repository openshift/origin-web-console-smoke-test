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
os::log::info "Storign obtained certificate"
certutil -d "sql:$HOME/.pki/nssdb" -A -n console -t Pu,, -i /tmp/console-e2e.pem

os::log::info "Launching protractor tests"
protractor $@
