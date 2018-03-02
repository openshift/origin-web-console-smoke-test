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
# firefox erm, firefox is called iceweasel? fo'realz?
RUN apt-get update
RUN apt-get -qqy --no-install-recommends install \
    xvfb \
    iceweasel

# handle app dependencies as a separate layer
# this already defines selenium-standalone as a dependency
# so we shouldn't need to install selenium, java, etc.
ADD package.json /tmp/dependencies/package.json

# install deps in tmp
# then move them to final location
RUN cd /tmp/dependencies && yarn install && \
    mkdir -p /opt/origin-smoke-test && \
    cp -a /tmp/dependencies/node_modules /opt/origin-smoke-test

# now, install our app as a separate layer
ADD . /opt/origin-smoke-test

# set user so webdriver can do install things
RUN useradd -ms /bin/bash smoke-tester && \
    chmod -R 755 /opt/origin-smoke-test && \
    chown -R smoke-tester:smoke-tester /opt/origin-smoke-test

USER smoke-tester
ENV HOME /opt/origin-smoke-test
WORKDIR /opt/origin-smoke-test

# not sure we need this, actually.
EXPOSE 3000

CMD ["/opt/origin-smoke-test/run.sh"]
