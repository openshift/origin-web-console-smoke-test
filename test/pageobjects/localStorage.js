'use strict';

const types = [
  'localStorage',
  'sessionStorage'
];

class LocalStore {
  constructor(type = 'localStorage') {
    if(!types.includes(type)) {
      throw new Error(type, 'is not a storage option');
    }
    this.storeType = type;
  }
  setItem(key, value) {
    // TODO:
    // assume that user will stringify if needed. cant auto this.
    // const string = JSON.stringify(value);
    return browser.executeScript(function(storeType, key, toSave) {
      return window[storeType].setItem(key, toSave);
    }, this.storeType, key, value);
  }
  getItem(key) {
    return browser.executeScript(function(storeType, key) {
      return window[storeType].getItem(key);
    }, this.storeType,  key);
  }
  get() {
    return browser.executeScript(function(storeType) {
      return window[storeType];
    }, this.storeType);
  }
  clear() {
    return browser.executeScript(function(storeType) {
      return window[storeType].clear();
    }, this.storeType);
  }
}

module.exports = LocalStore;
