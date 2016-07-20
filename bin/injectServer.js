var fs = require('fs');
var path = require('path');

var name = 'remotedev-server';
var startFlag = '/* ' + name + ' start */';
var endFlag = '/* ' + name + ' end */';
var serverFlag = '    _server(argv, config, resolve, reject);';

exports.dir = 'local-cli/server';
exports.file = 'server.js';
exports.fullPath = path.join(exports.dir, exports.file);

exports.inject = function(modulePath, options) {
  var filePath = path.join(modulePath, exports.fullPath);
  if (!fs.existsSync(filePath)) return false;

  var code = [
    startFlag,
    '    require("' + name + '")(' + JSON.stringify(options) + ')',
    '      .then(_remotedev =>',
    '        _remotedev.on("ready", () => {',
    '          if (!_remotedev.portAlreadyUsed) console.log("-".repeat(80));',
    '      ' + serverFlag,
    '        })',
    '      );',
    endFlag,
  ].join('\n');

  var serverCode = fs.readFileSync(filePath, 'utf-8');
  var start = serverCode.indexOf(startFlag);  // already injected ?
  var end = serverCode.indexOf(endFlag) + endFlag.length;
  if (start === -1) {
    start = serverCode.indexOf(serverFlag);
    end = start + serverFlag.length;
  }
  fs.writeFileSync(
    filePath,
    serverCode.substr(0, start) + code + serverCode.substr(end, serverCode.length)
  );
  return true;
};

exports.revert = function(modulePath) {
  var filePath = path.join(modulePath, exports.fullPath);
  if (!fs.existsSync(filePath)) return false;

  var serverCode = fs.readFileSync(filePath, 'utf-8');
  var start = serverCode.indexOf(startFlag); // already injected ?
  var end = serverCode.indexOf(endFlag) + endFlag.length;
  if (start !== -1) {
    fs.writeFileSync(
      filePath,
      serverCode.substr(0, start) + serverFlag + serverCode.substr(end, serverCode.length)
    );
  }
  return true;
};