'use strict';

const env = require('../environment');
const logger = require('../helpers/logger');
const timing = require('../helpers/timing');
const doLogin = require('../helpers/doLogin');
const Login = require('../pageobjects/login');

const selectors = {
  heading: 'h1'
};

beforeEach(() => {
  // TODO: just set in conf onPrepare() ?
  browser.ignoreSynchronization = true;
});

// example: http://ramonvictor.github.io/protractor/slides/#/10
describe('Openshift login page', () => {
  describe('login with OAuth flow', () => {
    it('should login and redirect to the catalog page', () => {
      doLogin.withOauthForm();
      const catalogHeading = element(by.css(selectors.heading));
      expect(catalogHeading.getText()).toBe('Browse Catalog');
    });
  });
});
