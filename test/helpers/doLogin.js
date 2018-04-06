'use strict';

const env = require('../environment');
const b64 = require('./b64');
const logger = require('../helpers/logger');
const timing = require('../helpers/timing');
const LocalStorage = require('../pageobjects/localStorage');
const LoginPage = require('../pageobjects/login');
const CatalogPage = require('../pageobjects/catalog');

const [favicon, mainCSS, configJS, html404] = [
  `${env.consoleUrl}/images/favicon.png`,
  `${env.consoleUrl}/styles/main.css`,
  `${env.consoleUrl}/config.js`,
  `${env.consoleUrl}/404.html`
];

// NOTE: this uses the default login form, it may not be available for
// all environments
const withOauthForm = (name = env.user.name, pass = env.user.pass) => {
  browser.get(html404);
  logger.setLogLevel('INFO');
  const login = new LoginPage();
  login.visit();
  browser.driver.sleep(timing.oauthRedirect);
  login.login({name, pass});
  return browser.sleep(10 * 1000);
};


const withTokenInjectedIntoLocalStorage = (token, username) => {
  username = username || process.env.CONSOLE_USER || 'e2e-user';
  const date = new Date(),
        year = date.getFullYear(),
        month = ('0' + date.getMonth() +1).slice(-2),
        day = ('0' + date.getDay() +1).slice(-2),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        fullDate = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`,
        ttl = new Date().getTime() + (60 * 1000);
  // Load a page on same domain w/o an oauth redirect
  browser.get(html404);
  logger.setLogLevel('INFO');

  const keys = {
    token: 'LocalStorageUserStore.token',
    tokenttl: 'LocalStorageUserStore.token.ttl',
    user: 'LocalStorageUserStore.user',
    userttl: 'LocalStorageUserStore.user.ttl'
  };

  const vals = {
    token: token || env.auth.token,
    tokenttl: ttl,
    user: `{
      "kind":"User",
      "apiVersion":
      "user.openshift.io/v1",
      "metadata":{
        "name":"${username}",
        "selfLink":"/apis/user.openshift.io/v1/users/${username}",
        "uid":"12345",
        "resourceVersion":"12345",
        "creationTimestamp":"${fullDate}"
      },
      "identities":["anypassword:${username}"],
      "groups":null
    }`,
    userttl: ttl
  };

  if(vals.token) {
    logger.info('Logging in with token');
    const storage = new LocalStorage();
    storage.setItem(keys.token, vals.token);
    storage.setItem(keys.tokenttl, vals.tokenttl);
    storage.setItem(keys.user, vals.user);
    storage.setItem(keys.userttl, vals.userttl);
    // if possible, make logs verbose for debugging
    logger.setLogLevel('INFO');
    browser.sleep(1 * 1000);
    storage.getItem(keys.token).then((retrievedToken) => {
      logger.log('Token verification:', `${retrievedToken.substr(0,10)}***(redacted)`);
    });

    const catalogPage = new CatalogPage();
    catalogPage.visit();
    return browser.sleep(1 * 1000);
  } else {
    logger.warn('No token available');
    return browser.sleep(1 * 1000);
  }
};


// NOTE: debunked, kept for historical reasons, at the moment.
const viaRedirectWithEncodedState = (token) => {
  let authState = {
    token_type: 'Bearer',
    access_token: token || env.auth.token,
    expires_in: '86400'
    // then: '/'
  };
  let encodedState = b64.encode(authState);
  // example of an auth redirect URI:
  // https://192.168.1.69:8443/console/oauth?code=<code>&state=<state>
  let simulatedRedirectUrl = `${env.authRedirectUrl}${encodedState}`;
  logger.log('doLogin.viaRedirectWithEncodedState()', simulatedRedirectUrl);
  browser.get(simulatedRedirectUrl);
  const catalogPage = new CatalogPage();
  console.log('catalog url:', catalogPage.getUrl());
  browser.sleep(5000);
};


module.exports = {
  withOauthForm,
  withTokenInjectedIntoLocalStorage,
  viaRedirectWithEncodedState
};
