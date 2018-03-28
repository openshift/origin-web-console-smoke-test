'use strict';

const env = require('../environment');
const Page = require('./page');

class CatalogPage extends Page {
  // the catalog page that is NOT within a project.
  // at this point we don't need to test the other catalog pages.
  getUrl() {
    return `${env.consoleUrl}/catalog`;
  }
}

module.exports = CatalogPage;
