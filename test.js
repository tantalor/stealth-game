#!/usr/bin/env node

StealthGame = require('./index.js');
assert = require('assert');


function TestModule() {};

TestModule.prototype.testModule = function() {
  assert(typeof StealthGame !== 'undefined',
      'StealthGame module is undefined.');
  assert(typeof StealthGame.Game === 'function',
      'StealthGame.Game method is missing.');
};


function TestScreen() {};

TestScreen.prototype.testSmallScreen = function() {
  var screen = new StealthGame.Screen(10, 10);
  assert.equal(screen.width, 10, 'Screen width.');
  assert.equal(screen.height, 10, 'Screen height.');
  assert.equal(screen.top, 0, 'Screen top.');
  assert.equal(screen.left, 0, 'Screen left.');
};

TestScreen.prototype.testLargeScreen = function() {
  var screen = new StealthGame.Screen(10000, 10000);
  assert.equal(screen.width, 1024, 'Screen width.');
  assert.equal(screen.height, 768, 'Screen height.');
  assert.equal(screen.top, 4616, 'Screen top.');
  assert.equal(screen.left, 4488, 'Screen left.');
};


runTests(TestModule);
runTests(TestScreen);

function runTests(ctor) {
  for (var key in ctor.prototype) {
    if (key.indexOf('test') == 0) {
      try {
        new ctor()[key]();
        console.log("OK %s.%s", ctor.name, key);
      } catch (e) {
        console.log("FAILED %s.%s", ctor.name, key);
        console.log(e);
      }
    }
  }
}
