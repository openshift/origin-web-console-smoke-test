'use strict';

// using express & prom-client
// https://github.com/siimon/prom-client

const express = require('express');
const server = express();

const parseString = require('xml2js').parseString;
const fs = require('fs');

const client = require('prom-client');
const register = client.register;

const testOutputPath = `${__dirname}/test_reports/junit/e2e-results.xml`;

// Dunno if we need this, but its encouraged via
// the docs to get the defaults...
// list is: client.collectDefaultMetrics.metricsList
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

//
const counter = new client.Counter({
  name: 'origin_web_console_smoke_test',
  help: 'The number of times the web console smoke tests pass (should be 1)'
});

const process = (data) => {
  data.testsuites.testsuite.forEach((suite) => {
    // currently we test login
    if(suite.$.failures === '0') {
      // we will increment the counter, yay a pass
      counter.inc();
    }
  });
}

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


// prometheus should scrape this endpoint for data.
server.get('/metrics', (req, res) => {
  console.log(`GET /metrics ${register.metrics()}`);
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});

server.get('/protractor', (req, res) => {
  var sys = require('util');
  var exec = require('child_process').exec;
  var child;
  console.log("[INFO] Running protractor tests");
  child = exec("protractor /protractor/protractor.conf.js", function (error, stdout, stderr) {
    // sys.print('stderr: ' + stderr);
    if (error !== null) {
      console.log('[ERROR] ' + error);
    } else {
      res.send("[INFO] Test triggered.");
    }
    console.log('[INFO] ' + stdout);
  });
  res.end();
});

console.log('[INFO] Server listening to 3000.');
console.log('[INFO] Exposed enpoints:');
console.log('[INFO]  /metrics - for scraping test results');
console.log('[INFO]  /protractor - for triggering origin-web-console smoke test');
server.listen(3000);
