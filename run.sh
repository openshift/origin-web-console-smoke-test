#!/bin/bash

# non headless...?
if [ -z "$1" ]; then
  echo "hi, 1"
else
  echo "hi, 2"
fi

# try selenium w/headless chrome locally!
./selenium.webdriver.js
# try webdriver.io with headless chrome locally!
./webdriver.io.js
