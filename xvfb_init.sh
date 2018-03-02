#!/bin/bash

# TODO: env vars or no?
export DISPLAY=:99
Xvfb :99 -shmem -screen 0 1366x768x16
