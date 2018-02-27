// TODO: needs to be configurable via env vars
const protocol = 'https://',
    host = '127.0.0.1',
    serverPort = 8443,
    baseUrl = `${protocol}${host}:${serverPort}`,
    consoleUrl = `${baseUrl}/console`,
    loginUrl = `${baseUrl}/login`;

module.exports = {
  baseUrl: baseUrl,
  loginUrl: loginUrl,
  consoleUrl: consoleUrl,
  isMac: /^darwin/.test(process.platform)
};
