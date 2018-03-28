'use strict';

// Use logger functions in place of console to ensure that log messages are wrapped
// in a promise & resolved asyncronously.
// NOTE: even if you don't use .then(), the promise queue is still synchronized.
// This is handy, a bit weird.
const COLORS = {
  // all foreground colors
  // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
  reset:  '\x1b[0m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  blue:   '\x1b[36m',
  green:  '\x1b[32m'
};

[
  {key: 'log',      prefix: 'log',      color: COLORS.reset },
  {key: 'info',     prefix: 'info',     color: COLORS.blue },
  {key: 'warn',     prefix: 'warn',     color: COLORS.yellow },
  {key: 'error',    prefix: 'error',    color: COLORS.red },
  {key: 'success',  prefix: 'success',  color: COLORS.green },
].forEach((logType) => {
  module.exports[logType.key] = function(...args) {
    // Logs outside of the promise wrapper, and then again below
    // with the promise wrapped log.  This helps with some quirky
    // debugging.  Perhaps should be a specific log level or
    // different flag
    if(+process.env.LOG_LEVEL > 0) {
      console[logType.key].apply(console, [
        logType.color,
        `\\${logType.prefix}/ (syncronous)`,
        ...args,
        COLORS.reset
      ]);
    }
    // http://webdriver.io/api/utility/call.html
    browser.call(() => {
      console[logType.key].apply(console, [
        logType.color,
        `[${logType.prefix}]`,
        ...args,
        COLORS.reset
      ]);
    });
  };
});

//
module.exports.setLogLevel = (level = 'INFO') => {
  return browser.executeScript(function(level) {
    localStorage["OpenShiftLogLevel.main"] = level;
    localStorage["OpenShiftLogLevel.auth"] = level;
  }, level);
}
