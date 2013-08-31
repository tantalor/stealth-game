#!/usr/bin/env node

StealthGame = require('./index.js');
assert = require('assert');


function TestModule() {};

TestModule.prototype.testModule = function() {
  assert(typeof StealthGame !== 'undefined', 'StealthGame module is undefined.');
  assert(typeof StealthGame.Game === 'function',
      'StealthGame.Game method is missing.');
};


runTests(TestModule);

function runTests(ctor) {
  for (var key in ctor.prototype) {
    if (key.indexOf('test') == 0) new ctor()[key]();
  }
}
