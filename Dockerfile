FROM centos:7

# Install and update nodejs and it's dependencies
RUN yum install -y epel-release libappindicator
RUN yum install -y nodejs
RUN yum update -y

# Install protractor and google-chrome dependencies
WORKDIR /tmp
COPY webdriver-versions.js ./
ENV NODE_PATH=/usr/lib/node_modules:/protractor/node_modules
RUN npm install -g protractor@4.0.14 minimist@1.2.0
RUN node ./webdriver-versions.js --chromedriver 2.32 && \
    webdriver-manager update && \
    yum install -y wget vim openssl.x86_64 nss-tools.x86_64 java-1.8.0-openjdk.x86_64 libXScrnSaver lsb GConf2 gtk3 && \
    mkdir /protractor

# Install google-chrome 59 because newer versions introduce permissions problems with certificates
ADD ./google-chrome-stable-59.rpm /tmp/google-chrome-stable-59.rpm
RUN rpm -ivh /tmp/google-chrome-stable-59.rpm

COPY smoke-test.sh /
ADD test /protractor/
RUN cd /protractor && npm install
WORKDIR /protractor
RUN mkdir -p /.pki/nssdb /.local/share/applications/ && \
    certutil -d /.pki/nssdb -N && \
    /bin/bash -c 'chmod -R 777 /.local' && \
    /bin/bash -c 'chmod -R 777 /.pki' && \
    /bin/bash -c 'chmod -R 777 /smoke-test.sh' && \
    /bin/bash -c 'chmod -R 777 /protractor'

ENTRYPOINT ["/smoke-test.sh"]
