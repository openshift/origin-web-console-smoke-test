const env = require('../helpers/environment');
const Login = require('../pageobjects/login');


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
      const user = {
        name: 'e2e-user',
        pass: 'e2e-user'
      };
      loginPage.visit();
      loginPage.login(user.name, user.pass);
      // arbitrary sleep... should remove, flaky tests!
      browser.driver.sleep(1000);
      const catalogHeading = element(by.css('h1'));
      expect(catalogHeading.getText()).toBe('Browse Catalog');
    });
  });
});
