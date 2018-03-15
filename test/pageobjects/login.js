const Page = require('./page');
const environment = require('../environment');
const timing = require('../helpers/timing');
const logger = require('../helpers/logger');

class LoginPage extends Page {
  visit() {
    super.visit(environment.consoleUrl);
  }
  login(username, password) {
    logger.log('Login with:', username, password);
    element(by.css('#inputUsername')).sendKeys(username);
    element(by.css('#inputPassword')).sendKeys(password);
    element(by.css('button[type="submit"]')).click();
    // NOTE: timeouts make flaky tests.
    browser.driver.sleep(timing.oauthRedirect);
  }
}

module.exports = LoginPage;
