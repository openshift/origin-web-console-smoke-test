#!/bin/bash

docker run -it --rm \
  --env CONSOLE_URL="https://192.168.1.69:8443"  \
  --env CONSOLE_USER=jane \
  --env CONSOLE_PASSWORD=doe \
  --name console-smoke-test \
  origin-web-console-smoke-test
