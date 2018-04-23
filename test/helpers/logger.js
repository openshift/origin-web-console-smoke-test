'use strict';

// logger should be used in place of console.log()
// - logger provides [INFO] and other prefixes to the type of log consistently
// - logger by default is async, meaning it will be collected into
//   protractors promise queue & print logs at appropriate times.
// - logger can also be used syncronously, like console.log() if
//   that is needed, while still keeping the [INFO] and other prefixes,
//   as well as colors.
//
// Why the async hassle?
// This helper is made primarily to be used within protractor tests, which means
// logging must be asyncronous to have meaning.  Therefore, you must call
// logger.sync[key]('') to get an equivalent console.log, as it is the least
// frequent use case.
//
// example:
//   These would be logged asyncronously in protractors promise resolution flow:
//     logger.log(`Something eventually ${someVar}`);        // [INFO] Something eventually <...>
//     logger.async.log(`Something eventually ${someVar}`);  // [INFO] Something eventually <...>
//   This would be logged syncronously (immediately)
//     logger.sync.log(`Something now ${someVar}`);          // [INFO] Something now <...>
const COLORS = {
  // Currently these are just forground (text) colors:
  // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
  reset:  '\x1b[0m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  blue:   '\x1b[36m',
  green:  '\x1b[32m'
};

[
  {key: 'log',      prefix: 'INFO',     color: COLORS.reset },
  {key: 'info',     prefix: 'INFO',     color: COLORS.blue },
  {key: 'warn',     prefix: 'WARN',     color: COLORS.yellow },
  {key: 'error',    prefix: 'ERROR',    color: COLORS.red },
  {key: 'success',  prefix: 'SUCCESS',  color: COLORS.green },
].forEach((logType) => {
  let logger = console[logType.key] || console.log;

  var syncLoggingFunction = function(...args) {
    logger.apply(console, [
      logType.color,
      `[${logType.prefix}]`,
      ...args,
      COLORS.reset
    ]);
  };

  var asyncLoggingFunction = function(...args) {
    browser.call(() => {
      logger.apply(console, [
        logType.color,
        `[${logType.prefix}]`,
        ...args,
        COLORS.reset
      ]);
    });
  };

  module.exports.async = module.exports.async || {};
  module.exports.sync = module.exports.sync || {};

  module.exports[logType.key] = asyncLoggingFunction;
  module.exports.async[logType.key] = asyncLoggingFunction;
  module.exports.sync[logType.key] = syncLoggingFunction;

});

// This attempts to set the logLevel in the browser, in case
// debugging with a browser.pause() is needed.
module.exports.setLogLevel = (level = 'INFO') => {
  return browser.executeScript(function(level) {
    localStorage["OpenShiftLogLevel.main"] = level;
    localStorage["OpenShiftLogLevel.auth"] = level;
  }, level);
};
