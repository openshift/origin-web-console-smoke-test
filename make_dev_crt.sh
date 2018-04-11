#!/bin/bash
set -o errexit
set -o nounset
set -o pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

mkdir -p "${DIR}/.tmp";
mkdir -p "${PWD}/tls";

# generate
openssl req \
  -x509 \
  -newkey rsa:2048 \
  -keyout "${DIR}/.tmp/key.pem" \
  -out "${DIR}/.tmp/cert.pem" \
  -days 365

# remove passphrase
openssl rsa \
  -in "${DIR}/.tmp/key.pem" \
  -out "${DIR}/.tmp/newkey.pem" \
  && mv "${DIR}/.tmp/newkey.pem" "${DIR}/.tmp/key.pem"

# final resting place
mv "${DIR}/.tmp/key.pem" "${PWD}/tls/tls.key"
mv "${DIR}/.tmp/cert.pem" "${PWD}/tls/tls.crt"
