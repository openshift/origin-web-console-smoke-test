const logger = require('../helpers/logger');
const doLogin = require('../helpers/doLogin');
// This flow should:
// - use an oauth token if provided as an environment variable
// - fall back to doing the oauth login flow
describe('Login with a service account token or fallback to the oauth flow', () => {
  it('should use a service account token when available', () => {
    logger.log('Login with SA token, else fallback to OAuth flow');
    doLogin().then(() => {
      logger.log('Waiting for a page....?');
      browser.sleep(30 * 1000);
      const catalogHeading = element(by.css('h1'));
      expect(catalogHeading.getText()).toBe('Browse Catalog');
    });
  });
});
