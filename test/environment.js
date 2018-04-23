'use strict';

const logger = require('./helpers/logger');

const
  protocol = 'https',
  defaultHost = '127.0.0.1',
  serverPort = 8443,
  baseUrl = process.env.CONSOLE_URL || `${protocol}://${defaultHost}:${serverPort}`,
  consoleUrl = `${baseUrl}/console`,
  loginUrl = `${baseUrl}/login`,
  authRedirectUrl = `${baseUrl}/oauth/authorize?client_id=openshift-web-console&response_type=token&state=`;


const KEY_PATH = '/etc/tls-certs/tls.key';
const CRT_PATH = '/etc/tls-certs/tls.crt';

const TOKEN = (
  // if the user passes in a token as an env var, use that
  process.env.TOKEN ||
  // otherwise fallback to our script to search for a
  // service acct token, which should also be provided as
  // an env var
  process.env.SERVICE_ACCOUNT_TOKEN
);
const auth = {
  token: TOKEN
};

// Default test interval is 5 minutes
const test_interval = parseInt(process.env.TEST_INTERVAL_MINUTES) * 60000 || 300000;

const user = {
  name:  process.env.CONSOLE_USER || 'e2e-user',
  pass: process.env.CONSOLE_PASSWORD || 'e2e-user'
};

if(!process.env.CONSOLE_URL) {
  logger.sync.log(`CONSOLE_URL is not defined, using ${baseUrl}`);
} else {
  logger.sync.log(`CONSOLE_URL is ${baseUrl}`);
}

if(process.env.TOKEN) {
  logger.sync.log(`TOKEN is ${process.env.TOKEN.substr(0,10)}***(redacted)`);
} else if(process.env.SERVICE_ACCOUNT_TOKEN) {
  logger.sync.log(`SERVICE_ACCOUNT_TOKEN is ${process.env.SERVICE_ACCOUNT_TOKEN.substr(0,10)}***(redacted)`);
}

module.exports = {
  baseUrl,
  loginUrl,
  consoleUrl,
  authRedirectUrl,
  isMac: /^darwin/.test(process.platform),
  test_interval,
  user,
  auth,
  tls: {
    keyPath: KEY_PATH,
    crtPath: CRT_PATH
  }
};
