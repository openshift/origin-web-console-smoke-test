'use strict';

const env = require('../environment');
const doLogin = require('../helpers/doLogin');
const CatalogPage = require('../pageobjects/catalog');
const LocalStorage = require('../pageobjects/localStorage');
const timing = require('../helpers/timing');

beforeEach(() => {
  // TODO: just set in conf onPrepare() ?
  browser.ignoreSynchronization = true;
});

describe('Openshift login page', () => {
  describe('bypass OAuth with service account token', () => {
    //
    // NOTE: this will not run locally if you manually $(yarn bin)/protractor protractor.conf.js.
    // A service account will only be created if you deploy the kube/pod.yaml within openshift,
    // either via `oc create -f` or using the import yaml feature in the web console.
    it('should bypass the login flow by injecting a service account token into localStorage', () => {
      // to simulate a login, run the console locally or otherwise & do the auth flow,
      // then copy LocalStorageUserStore.token & paste as a string here.
      var hardCodedToken = null;
      doLogin.withTokenInjectedIntoLocalStorage(hardCodedToken);
      const catalogHeading = element(by.css('h1'));
      expect(catalogHeading.getText()).toBe('Browse Catalog');
    });
  });
});
