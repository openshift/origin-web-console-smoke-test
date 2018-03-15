'use strict';

// Use logger functions in place of console to ensure that log messages are wrapped
// in a promise & resolved asyncronously.
// NOTE: even if you don't use .then(), the promise queue is still synchronized.
// This is handy, a bit weird.
['log', 'info', 'warn', 'error'].forEach((logType) => {
  exports[logType] = function() {
    let args = Array.prototype.slice.call(arguments);
    // http://webdriver.io/api/utility/call.html
    browser.call(() => {
      console[logType].apply(console, args);
    });
  };
});
