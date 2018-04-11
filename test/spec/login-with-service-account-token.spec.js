'use strict';

const env = require('../environment');
const doLogin = require('../helpers/doLogin');
const CatalogPage = require('../pageobjects/catalog');
const LocalStorage = require('../pageobjects/localStorage');
const timing = require('../helpers/timing');
const logger = require('../helpers/logger');

beforeEach(() => {
  // should be set in protractor.conf onPrepare()
  browser.ignoreSynchronization = true;
});

describe('Openshift login page', () => {
  describe('bypass OAuth with service account token', () => {
    it('should bypass the login flow by injecting a service account token into localStorage', () => {
      doLogin.withTokenInjectedIntoLocalStorage();
      const catalogHeading = element(by.css('h1'));
      expect(catalogHeading.getText()).toBe('Browse Catalog');
    });
  });
});
