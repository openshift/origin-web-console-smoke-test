const
  protocol = 'https://',
  host = '127.0.0.1',
  serverPort = 8443,
  // env var for public url should be complete: https://192.168.1.69:8443
  baseUrl = process.env.CONSOLE_URL || `${protocol}${host}:${serverPort}`,
  consoleUrl = `${baseUrl}/console`,
  loginUrl = `${baseUrl}/login`;

const USER_NAME = process.env.CONSOLE_USER || 'e2e-user';
const USER_PASS = process.env.CONSOLE_PASSWORD || 'e2e-user';

module.exports = {
  baseUrl: baseUrl,
  loginUrl: loginUrl,
  consoleUrl: consoleUrl,
  isMac: /^darwin/.test(process.platform),
  user: {
    name: USER_NAME,
    pass: USER_PASS
  }
};
