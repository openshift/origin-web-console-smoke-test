'use strict';

// to simulate an auth redirect, we need to base64 encode the object with the token
// base64 encoding should start with utf8 encoding.
// https://github.com/benjaminapetersen/angular-utf8-base64/blob/master/angular-utf8-base64.js
// https://github.com/mathiasbynens/utf8.js
const utf8 = require('utf8');
// https://www.npmjs.com/package/base-64
const base64 = require('base-64');

module.exports = {
  encode: (value) => {
    let str = JSON.stringify(value);
    let bytes = utf8.encode(str);
    let encoded = base64.encode(bytes);
    return encoded;
  },
  decode: (value) => {
    let decoded = base64.decode(value);
    let str = utf8.decode(decoded);
    let parsed = JSON.parse(str);
    return parsed;
  }
}
