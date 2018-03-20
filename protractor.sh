#!/bin/bash

proto=$(echo "$CONSOLE_URL" | grep :// | sed -e 's,^\(.*://\).*,\1,g')
url="${CONSOLE_URL/$proto/}"
host_with_port=$(echo "$url" | sed 's/\/.*$//')
host=$(echo "$host_with_port" | sed 's/:.*$//')
port=$(echo "$host_with_port" | grep : | sed -e 's,^.*:,:,g' -e 's,.*:\([0-9]*\).*,\1,g')

echo "Get and certificate for ${CONSOLE_URL}"
timeout 30 google-chrome --no-sandbox --headless --disable-gpu --dump-dom "$CONSOLE_URL" > /dev/null
echo 'GET /' | timeout 30 openssl s_client -showcerts -connect "$host:$port" | openssl x509 -outform PEM > bridge-e2e.pem
certutil -d "sql:$HOME/.pki/nssdb" -A -n bridge -t Pu,, -i bridge-e2e.pem

protractor protractor.conf.js
