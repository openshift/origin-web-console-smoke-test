'use strict';

// using express & prom-client
// https://github.com/siimon/prom-client
const https = require('https');
const express = require('express');
const server = express();

const parseString = require('xml2js').parseString;
const fs = require('fs');

const client = require('prom-client');
const register = client.register;

const exec = require('child_process').exec;
const env = require('./environment');
const logger = require('./helpers/logger');

const testOutputPath = `${__dirname}/test_reports/junit/e2e-results.xml`;

// 80/443 standard http/https
// do we need to allow this to be configured?
// need to ensure the var names are not confusing,
// this is not the port for the console, this is for
// the /metrics endpoint
const METRICS_SERVER_PORT = 3000;

// Dunno if we need this, but its encouraged via
// the docs to get the defaults...
// list is: client.collectDefaultMetrics.metricsList
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

//
const successCounter = new client.Counter({
  name: 'web_console_smoke_test_success',
  help: 'The number of times the web console smoke tests pass'
});
const failCounter = new client.Counter({
  name: 'web_console_smoke_test_fail',
  help: 'The number of times the web console smoke tests fail'
});

const process = (data) => {
  data.testsuites.testsuite.forEach((suite) => {
    if(suite.$.failures === '0') {
      successCounter.inc();
      failCounter.reset();
    } else {
      failCounter.inc();
    }
  });
};

// polling for successful test_report output
// from the protractor tests.
var fileReadInterval = setInterval(() => {
  fs.readFile(testOutputPath, (err, data) => {
    if(data) {
      parseString(data, (err, result) => {
        if(result) {
          process(result);
          // we only need to poll till we get a file read.
          clearInterval(fileReadInterval);
        }
      });
    }
  });
}, 1000);

var smokeTestsInterval = setInterval(() => {
  logger.sync.log(`Running smoke tests at ${env.test_interval / 60000} minute interval`);
  var child;
  child = exec("protractor /protractor/protractor.conf.js", function (error, stdout, stderr) {
    if (error !== null) {
      logger.sync.error(error);
      // Not sure if we want to stop testing after an error occurs
      // clearInterval(smokeTestsInterval);
    }
    logger.sync.log(stdout);
  });
}, env.test_interval);


var pollForCert = setTimeout(() => {
  if(!fs.existsSync(env.tls.keyPath)) {
    logger.sync.log(`Waiting for key path: ${env.tls.keyPath}`);
    logger.sync.log(`Waiting for cert path: ${env.tls.keyPath}`);
    return;
  }
  clearInterval(pollForCert);
  logger.sync.log('Key & Cert found, create server.');
  // server is given to https as a callback after it sets up https
  https
    .createServer({
      key: fs.readFileSync(env.tls.keyPath),
      cert: fs.readFileSync(env.tls.crtPath),
      // passphrase: 'ninnies'
    }, server)
    .listen(METRICS_SERVER_PORT, () => {
      logger.sync.log(`https listening on ${METRICS_SERVER_PORT}`);
    });
}, 3 * 1000);


// prometheus should scrape this endpoint for data.
server.get('/metrics', (req, res) => {
  logger.sync.log(`GET /metrics ${register.metrics()}`);
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});

logger.sync.log(`[INFO] Server listening to ${METRICS_SERVER_PORT}.`);
logger.sync.log('[INFO] Exposing /metrics enpoints for scraping test results');
