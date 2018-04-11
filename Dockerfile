FROM node:6.9.4-slim
WORKDIR /tmp
COPY webdriver-versions.js ./
ENV CHROME_PACKAGE="google-chrome-stable_59.0.3071.115-1_amd64.deb" NODE_PATH=/usr/local/lib/node_modules:/protractor/node_modules
RUN npm install -g protractor@4.0.14 minimist@1.2.0 && \
    node ./webdriver-versions.js --chromedriver 2.32 && \
    webdriver-manager update && \
    echo "deb http://ftp.debian.org/debian jessie-backports main" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y xvfb wget sudo libnss3-tools && \
    apt-get install -y -t jessie-backports openjdk-8-jre && \
    wget https://github.com/webnicer/chrome-downloads/raw/master/x64.deb/${CHROME_PACKAGE} && \
    dpkg --unpack ${CHROME_PACKAGE} && \
    apt-get install -f -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* \
    rm ${CHROME_PACKAGE} && \
    mkdir /protractor

COPY smoke-test.sh /
ADD test /protractor/
RUN cd /protractor && npm install
WORKDIR /protractor
RUN mkdir -p /.pki/nssdb && \
    certutil -d /.pki/nssdb -N && \
    /bin/bash -c 'chmod -R 777 /.pki' && \
    /bin/bash -c 'chmod -R 777 /smoke-test.sh' && \
    /bin/bash -c 'chmod -R 777 /protractor'

ENTRYPOINT ["/smoke-test.sh"]
