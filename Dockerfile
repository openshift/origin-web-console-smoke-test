# best practices
# https://docs.docker.com/v17.09/engine/userguide/eng-image/dockerfile_best-practices/#use-multi-stage-builds
#
# https://hub.docker.com/r/selenium/standalone-chrome/
# FROM selenium/standalone-firefox:latest
FROM nodejs:latest

# handle app dependencies as a separate layer
# this already defines selenium-standalone as a dependency
# so we shouldn't need to install selenium, java, etc.
ADD package.json /tmp/dependencies/package.json

RUN cd /tmp/dependencies && yarn install

RUN mkdir -p /opt/origin-smoke-test \
    && cp -a /tmp/dependencies/node_modules /opt/origin-smoke-test

WORKDIR /opt/origin-smoke-test

ADD . /opt/origin-smoke-test

EXPOSE 3000

CMD ["yarn", "test:run_once"]
