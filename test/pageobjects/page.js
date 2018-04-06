'use strict';

const logger = require('../helpers/logger');
const timing = require('../helpers/timing');

const waitFor = function(expected) {
  let actual;
  return browser.wait(() => {
    return browser.getCurrentUrl().then(url => {
      actual = url;
      return actual.includes(expected);
    });
  }, timing.maxWaitForElement, `URL is not ${expected} (is currently ${actual})`);
};

const goTo = function(uri) {
  return browser.get(uri).then(() =>  waitFor(uri));
};

class Page {
  getUrl() {
    logger.log('Page.getUrl() is not defined. Please override.');
  }
  visit () {
    logger.log('Visiting:', this.getUrl());
    return goTo(this.getUrl());
  }
}

module.exports = Page;
