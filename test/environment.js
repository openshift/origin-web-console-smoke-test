const
  protocol = 'https',
  defaultHost = '127.0.0.1'
  serverPort = 8443,
  baseUrl = process.env.CONSOLE_URL || `${protocol}://${defaultHost}:${serverPort}`,
  consoleUrl = `${baseUrl}/console`,
  loginUrl = `${baseUrl}/login`;

const USER_NAME = process.env.CONSOLE_USER || 'e2e-user';
const USER_PASS = process.env.CONSOLE_PASSWORD || 'e2e-user';

if(!process.env.CONSOLE_URL) {
  console.log(`CONSOLE_URL is not defined, using ${baseUrl}`);
} else {
  console.log(`CONSOLE_URL is ${baseUrl}`);
}

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
