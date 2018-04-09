#!/bin/bash
set -o errexit
set -o nounset
set -o pipefail

docker build -t origin-web-console-smoke-test .
