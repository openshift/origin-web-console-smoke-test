# influenced by & heavily borrowed from:
# https://github.com/ebidel/lighthouse-ci/blob/master/builder/Dockerfile
FROM node:8-slim

# Install utilities
RUN apt-get update --fix-missing && apt-get -y upgrade

# Install latest chrome dev package.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /src/*.deb

RUN mkdir -p /opt/origin-smoke-test

# risky, dont copy everything. esp with all these branches...
# COPY . /opt/origin-smoke-test
COPY run.sh /opt/origin-smoke-test

WORKDIR /opt/origin-smoke-test

# Add a chrome user and setup home dir.
RUN groupadd -r chrome && useradd -r -m -g chrome -G audio,video chrome && \
    mkdir -p /home/chrome/reports && \
    chown -R chrome:chrome /home/chrome

USER chrome

CMD ./run.sh
