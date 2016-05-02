#! /usr/bin/env node
var fs = require('fs');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));

function readFile(filePath) {
  return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');
}

if (argv.protocol === 'https') {
  argv.key = argv.key ? readFile(argv.key) : null;
  argv.cert = argv.cert ? readFile(argv.cert) : null;
}

require('./server')(argv);
