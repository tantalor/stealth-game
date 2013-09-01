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

TestScreen.prototype.testClientToScreen = function() {
  var screen = new StealthGame.Screen(10000, 10000);
  assert.equal(screen.clientToScreenX(4488), 0, 'Client to screen x.')
  assert.equal(screen.clientToScreenY(4616), 0, 'Client to screen y.')
};


function TestCamera() {};

TestCamera.prototype.testWideScreenCamera = function() {
  var screen = new StealthGame.Screen(100, 10);
  var camera = new StealthGame.Camera(screen);
  assert.equal(camera.screenToWorldY(0), 1, 'Screen top to world.');
  assert.equal(camera.screenToWorldX(100), 10, 'Screen right to world.');
  assert.equal(camera.screenToWorldY(10), -1, 'Screen bottom to world.');
  assert.equal(camera.screenToWorldX(0), -10, 'Screen left to world.');
};


TestCamera.prototype.testTallScreenCamera = function() {
  var screen = new StealthGame.Screen(10, 100);
  var camera = new StealthGame.Camera(screen);
  
  // assert.equal(camera.screenToWorldY(0), 10, 'Screen top to world.');
  assert.equal(camera.screenToWorldX(10), 1, 'Screen right to world.');
  // assert.equal(camera.screenToWorldY(100), -10, 'Screen bottom to world.');
  assert.equal(camera.screenToWorldX(0), -1, 'Screen left to world.');
};


runTests(TestModule);
runTests(TestScreen);
runTests(TestCamera);

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
