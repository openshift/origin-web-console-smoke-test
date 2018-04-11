'use strict';

const
  protocol = 'https',
  defaultHost = '127.0.0.1',
  serverPort = 8443,
  baseUrl = process.env.CONSOLE_URL || `${protocol}://${defaultHost}:${serverPort}`,
  consoleUrl = `${baseUrl}/console`,
  loginUrl = `${baseUrl}/login`,
  authRedirectUrl = `${baseUrl}/oauth/authorize?client_id=openshift-web-console&response_type=token&state=`;

const SERVICE_ACCOUNT_TOKEN = (
  // if the user passes in a token as an env var, use that
  process.env.TOKEN ||
  // otherwise fallback to our script to search for a
  // service acct token, which should also be provided as
  // an env var
  process.env.SERVICE_ACCOUNT_TOKEN
)
const auth = {
  token: SERVICE_ACCOUNT_TOKEN
};

// Default test interval is 5 minutes
const test_interval = parseInt(process.env.TEST_INTERVAL_MINUTES) * 60000 || 300000;

const user = {
  name:  process.env.CONSOLE_USER || 'e2e-user',
  pass: process.env.CONSOLE_PASSWORD || 'e2e-user'
};

if(!process.env.CONSOLE_URL) {
  console.log(`CONSOLE_URL is not defined, using ${baseUrl}`);
} else {
  console.log(`CONSOLE_URL is ${baseUrl}`);
}

module.exports = {
  baseUrl,
  loginUrl,
  consoleUrl,
  authRedirectUrl,
  isMac: /^darwin/.test(process.platform),
  test_interval,
  user,
  auth
};
