const parser = require('./lib/parser.js').parser;
const ruler = require('./lib/createLineRules.js');
const inject = require('./lib/injector.js');
const run = require('./lib/run.js');
const fs = require('fs');

const minty = {};

minty.file = function file(path) {
  const JSTEXT = fs.readFileSync(path);
  const parsed = parser(JSTEXT);
  const rules = ruler(parsed);
  const injected = inject(rules, JSTEXT);
  run.runFile(injected, path);
};

minty.wrap = function wrap(func) {
  const JSTEXT = func.toString();
  const parsed = parser(JSTEXT);
  const rules = ruler(parsed);
  const injected = inject(rules, JSTEXT);
  const mintified = run.wrap(injected);
  return function() {
    const args = Array.prototype.slice.call(arguments);
    mintified.apply(null, args);
  };
};

module.exports = minty;
