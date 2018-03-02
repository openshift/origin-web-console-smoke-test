# best practices
# https://docs.docker.com/v17.09/engine/userguide/eng-image/dockerfile_best-practices/#use-multi-stage-builds
#
# tests in a container:
# https://hackernoon.com/running-karma-tests-with-headless-chrome-inside-docker-ae4aceb06ed3
#
# https://hub.docker.com/r/selenium/standalone-chrome/
# FROM selenium/standalone-firefox:latest
FROM node:latest

# Install firefox
RUN apt-get update && \
    apt-get install -y firefox
    # will firefox need xvfb to run headless?
    # apt-get install xvfb 

# handle app dependencies as a separate layer
# this already defines selenium-standalone as a dependency
# so we shouldn't need to install selenium, java, etc.
ADD package.json /tmp/dependencies/package.json

RUN cd /tmp/dependencies && yarn install

RUN mkdir -p /opt/origin-smoke-test \
    && cp -a /tmp/dependencies/node_modules /opt/origin-smoke-test

WORKDIR /opt/origin-smoke-test

# add the rest of the app here, ignoring whats in the .dockerignore
# so that our node_modules folder doesn't overwrite the above install,
# which keeps our actual app on a separate layer than the dependencies,
# to improve caching.
ADD . /opt/origin-smoke-test

# not sure we need this, actually.
# EXPOSE 3000

# TODO: gotta pipe the CONSOLE_PUBLIC_URL environment var to this
CMD ["yarn", "test:run_once"]
