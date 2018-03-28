'use strict';

const isMac = /^darwin/.test(process.platform);
// const isDocker = require('is-docker')();
const { SpecReporter } = require('jasmine-spec-reporter');
const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
const jasmineReporters = require('jasmine-reporters');
// const SERVICE_ACCOUNT_TOKEN = process.env.SERVICE_ACCOUNT_TOKEN;
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
  savePath: `${output}/junit`,
  filePrefix: 'e2e-results'
});

exports.config = {
  // TODO: update & use this?
  // baseUrl: process.env.CONSOLE_URL,
  // skip webdriver manager, selenium, etc
  directConnect: true,
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      // TODO: non-mac users may also run this locally & want to
      // see the browser
      'args': isMac ?
        [] :
        ['no-sandbox', 'headless', 'window-size=1400,1050']
    },
    acceptInsecureCerts : true
  },
  // TODO: update docs to show flag --spec='spec/to/run.spec.js'
  // as we may want to use different flows in different environments.
  // specs: ['spec/login-with-oauth-flow.spec.js'],
  specs: ['spec/login-with-service-account-token.spec.js'],
  logLevel: 'DEBUG', // 'ERROR'|'WARN'|'INFO'|'DEBUG'
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

    jasmine.getEnv().addReporter(screenshotReporter);

    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: true,
      displaySuccessfulSpec: false,
      displayFailedSpec: true
    }));

    jasmine.getEnv().addReporter(junitReporter);

    // can't set the window size in headless mode
    // browser.driver.manage().window().setSize(1280, 1024);
    // we don't want to act like we are testing
    // an angular site. lets just pretend its vanilla.
    browser.ignoreSynchronization = true;

    // nope, not in node.js land anymore...
    // console.log('look for data....');
    // return new Promise(function(resolve, reject) {
    //   fs.readFile(secretPath, (err, data) => {
    //     if(data) {
    //       console.log('data?', data);
    //       resolve();
    //     } else {
    //       console.log('no data', err);
    //       reject();
    //     }
    //   });
    // });
  }
};
