'use strict';

const environment = require('../environment');
const timing = require('../helpers/timing');
const logger = require('../helpers/logger');

const Page = require('./page');

const selectors = {
  username: '#inputUsername',
  password: '#inputPassword',
  submit: 'button[type="submit"]'
};

class LoginPage extends Page {
  getUrl() {
    return environment.consoleUrl;
  }
  // es6 destructure w/default values && a default empty obj
  // http://2ality.com/2015/01/es6-destructuring.html#simulating-named-parameters-in-javascript
  login({ name='unknown user', pass='nope' } = {}) {
    logger.log('Login with:', name, pass);
    element(by.css(selectors.username)).sendKeys(name);
    element(by.css(selectors.password)).sendKeys(pass);
    element(by.css(selectors.submit)).click();
    // NOTE: timeouts make flaky tests.
    return browser.driver.sleep(timing.oauthRedirect);
  }
}

module.exports = LoginPage;
