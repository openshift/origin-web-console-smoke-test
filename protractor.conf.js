'use strict';

const isMac = /^darwin/.test(process.platform);
let isDocker = require('is-docker')();
const { SpecReporter } = require('jasmine-spec-reporter');
const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
const jasmineReporters = require('jasmine-reporters');

const output = './test_reports';

const screenshotReporter = new HtmlScreenshotReporter({
  cleanDestination: isMac ? true : false,
  dest: `${output}/screenshots`,
  filename: 'protractor-e2e-report.html',
  takeScreenShotsOnlyForFailedSpecs: true,
  pathBuilder: function(currentSpec, suites, browserCapabilities) {
    return browserCapabilities.get('browserName') + '/' + currentSpec.fullName;
  }
});

const junitReporter = new jasmineReporters.JUnitXmlReporter({
  consolidateAll: true,
  savePath: `${output}/junint`,
  filePrefix: 'e2e-results'
});


console.log('protractor.conf.js', 'Environment?');
console.log('------------');
console.log(process.env.CONSOLE_URL);
console.log(process.env.CONSOLE_USER);
console.log(process.env.CONSOLE_PASSWORD);

// TODO: dedupe from helpers/environment.js once its working
const
  protocol = 'https://',
  host = '127.0.0.1',
  serverPort = 8443,
  // env var for public url should be complete: https://192.168.1.69:8443
  baseUrl = process.env.CONSOLE_URL || `${protocol}${host}:${serverPort}`,
  consoleUrl = `${baseUrl}/console`,
  loginUrl = `${baseUrl}/login`;

exports.config = {
  // skip webdriver manager, selenium, etc
  directConnect: true,

  baseUrl: baseUrl,

  capabilities: {
    'browserName': 'firefox',
    'marionnette': true,
    acceptInsecureCerts : true
    // 'moz:firefoxOptions': {
    //   args: [ '-headless' ]
    // }
  },

  specs: ['test/spec/**/*.spec.js'],
  framework: 'jasmine',
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
  }
};
