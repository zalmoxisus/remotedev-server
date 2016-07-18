#! /usr/bin/env node
var fs = require('fs');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var chalk = require('chalk');
var getOptions = require('./getOptions');
var injectServer = require('./injectServer');

function readFile(filePath) {
  return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');
}

if (argv.protocol === 'https') {
  argv.key = argv.key ? readFile(argv.key) : null;
  argv.cert = argv.cert ? readFile(argv.cert) : null;
}

function log(pass, msg) {
  var prefix = pass ? chalk.green.bgBlack('PASS') : chalk.red.bgBlack('FAIL');
  var color = pass ? chalk.blue : chalk.red;
  console.log(prefix, color(msg));
};

function getModuleName(type) {
  switch (type) {
    case 'desktop':
      return 'react-native-desktop';
    case 'reactnative':
    default:
      return 'react-native';
  }
}

function getModulePath(type) {
  var moduleName = getModuleName(type);
  return path.join(process.cwd(), 'node_modules', moduleName);
}

if (argv.revert) {
  var pass = injectServer.revert(getModulePath(argv.revert));
  var msg = 'Revert injection of RemoteDev server from React Native local server';
  log(pass, msg + (!pass ? ', the file `' + injectServer.fullPath + '` not found.' : '.'));

  process.exit(pass ? 0 : 1);
}

if (argv.injectserver) {
  var options = getOptions(argv);
  var pass = injectServer.inject(getModulePath(argv.injectserver), options);
  var msg = 'Inject RemoteDev server into React Native local server';
  log(pass, msg + (pass ? '.' : ', the file `' + injectServer.fullPath + '` not found.'));

  process.exit(pass ? 0 : 1);
}

require('./server')(argv);
