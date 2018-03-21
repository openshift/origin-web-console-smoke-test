const env = require('../environment');
const Login = require('../pageobjects/login');
const timing = require('../helpers/timing');

beforeEach(() => {
  // TODO: just set in conf onPrepare() ?
  browser.ignoreSynchronization = true;
});

// example: http://ramonvictor.github.io/protractor/slides/#/10
describe('Openshift login page', () => {
  describe('oauth flow', () => {
    it('should login and redirect to the catalog page', () => {
      // if we don't have a token we should automatically redirect to the login page.
      //browser.get(env.consoleUrl);
      const loginPage = new Login();
      const user = env.user;
      loginPage.visit();
      browser.driver.sleep(timing.oauthRedirect);
      loginPage.login(user.name, user.pass);
      browser.getCurrentUrl();
      // arbitrary sleep... should remove, flaky tests!
      const catalogHeading = element(by.css('h1'));
      expect(catalogHeading.getText()).toBe('Browse Catalog');
    });
  });
});
