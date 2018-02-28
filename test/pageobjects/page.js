'use strict';

const logger = require('../helpers/logger');
const timing = require('../helpers/timing');

class Page {
  visit (path) {
    logger.log('Visiting:', path);
    browser.get(path);
    // NOTE: timeouts make flaky tests.
    browser.driver.sleep(timing.initialVisit);
  }
}

module.exports = Page;
