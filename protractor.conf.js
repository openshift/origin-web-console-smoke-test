'use strict';

let isMac = /^darwin/.test(process.platform);
let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
let HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
let jasmineReporters = require('jasmine-reporters');

let screenshotReporter = new HtmlScreenshotReporter({
  cleanDestination: isMac ? true : false,
  dest: './test/tmp/screenshots',
  filename: 'protractor-e2e-report.html',
  takeScreenShotsOnlyForFailedSpecs: true,
  pathBuilder: function(currentSpec, suites, browserCapabilities) {
   return browserCapabilities.get('browserName') + '/' + currentSpec.fullName;
  }
});

let junitReporter = new jasmineReporters.JUnitXmlReporter({
   consolidateAll: true,
   savePath: 'test/junit',
   filePrefix: 'e2e-results'
});


exports.config = {
  // skip webdriver manager, selenium, etc
  directConnect: true,

  capabilities: {
    'browserName': 'chrome'
  },

  specs: ['test/spec/**/*.spec.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    isVerbose: true,
    includeStackTrace: true,
    // noop for dot reporter, using better reporters below
    print: function() {}
  },
  onPrepare: function() {
    browser.driver.manage().window().setSize(1200, 800);
    // we don't want to act like we are testing
    // an angular site. lets just pretend its vanilla.
    browser.ignoreSynchronization = true;

    jasmine.getEnv().addReporter(screenshotReporter);

    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: true,
      displaySuccessfulSpec: false,
      displayFailedSpec: true
    }));

    jasmine.getEnv().addReporter(junitReporter);


  },

};
