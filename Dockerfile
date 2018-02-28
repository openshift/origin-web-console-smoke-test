# best practices
# https://docs.docker.com/v17.09/engine/userguide/eng-image/dockerfile_best-practices/#use-multi-stage-builds
#
# tests in a container:
# https://hackernoon.com/running-karma-tests-with-headless-chrome-inside-docker-ae4aceb06ed3
#
# https://hub.docker.com/r/selenium/standalone-chrome/
# FROM selenium/standalone-firefox:latest
FROM node:latest

# OPTIONAL: Install dumb-init (Very handy for easier signal handling of SIGINT/SIGTERM/SIGKILL etc.)
RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64.deb
RUN dpkg -i dumb-init_*.deb
ENTRYPOINT ["dumb-init"]

# DO we need a yarn cache?
ADD .yarn_cache /.cache/yarn

# Install Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update \
    && apt-get install -y google-chrome-stable \
    # adding xvfb here
    && apt-get install xvfb

# Install Firefox
# RUN echo “deb http://ppa.launchpad.net/mozillateam/firefox-next/ubuntu trusty main” > /etc/apt/sources.list.d//mozillateam-firefox-next-trusty.list
# RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys CE49EC21
# RUN apt-get update
# RUN apt-get install -y firefox xvfb python-pip
# Install Selenium
# RUN pip install selenium
# RUN mkdir -p /root/selenium_wd_tests
# ADD sel_wd_new_user.py /root/selenium_wd_tests
# INstall xvfb
ADD xvfb.init /etc/init.d/xvfb
RUN chmod +x /etc/init.d/xvfb
RUN update-rc.d xvfb defaults

# handle app dependencies as a separate layer
# this already defines selenium-standalone as a dependency
# so we shouldn't need to install selenium, java, etc.
ADD package.json /tmp/dependencies/package.json

RUN cd /tmp/dependencies && yarn install

RUN mkdir -p /opt/origin-smoke-test \
    && cp -a /tmp/dependencies/node_modules /opt/origin-smoke-test

WORKDIR /opt/origin-smoke-test

ADD . /opt/origin-smoke-test

# not sure we need this, actually.
EXPOSE 3000

# TODO: gotta pipe the CONSOLE_PUBLIC_URL environment var to this
CMD ["yarn", "test:run_once"]
