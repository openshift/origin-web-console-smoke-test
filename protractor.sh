#!/bin/bash

# standard openshift preamble for bash scripts, but will break things :D
#set -o errexit
#set -o nounset
#set -o pipefail

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

# protractor will need this to login...
service_account_token=$(</var/run/secrets/kubernetes.io/serviceaccount/token)
if [[ -z "${service_account_token// }" ]]; then
  os::log::error "Failure to acquire service account token"
  # for now we will not fail as the user may opt to oauth?
  # exit 1
else
  os::log::info "Token ${service_account_token:0:10}***(redacted)"
fi
export SERVICE_ACCOUNT_TOKEN=$service_account_token

failed=1
if protractor $@; then
  failed=0
fi

node server.js
metrics_endpoint_status=$?
if [ $metrics_endpoint_status ]; then
  os::log::error "Failure to create /metrics endpoint"
  exit $metrics_endpoint_status
fi

exit $metrics_endpoint_status
