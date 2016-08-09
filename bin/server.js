var assign = require('object-assign');
var repeat = require('repeat-string');
var getOptions = require('./getOptions');
var getPort = require('getport');


var LOG_LEVEL_NONE = 0;
var LOG_LEVEL_ERROR = 1;
var LOG_LEVEL_WARN = 2;
var LOG_LEVEL_INFO = 3;

module.exports = function(argv) {
  var SocketCluster = require('socketcluster').SocketCluster;
  var options = assign(getOptions(argv), {
    workerController: __dirname + '/worker.js',
    allowClientPublish: false
  });
  var port = options.port;
  var logLevel = options.logLevel === undefined ? LOG_LEVEL_INFO : options.logLevel;
  return new Promise(function(resolve) {
    // Check port already used
    getPort(port, function(err, p) {
      if (err) {
        if (logLevel >= LOG_LEVEL_ERROR) {
          console.error(err);
        }
        return;
      }
      if (port !== p) {
        if (logLevel >= LOG_LEVEL_WARN) {
          console.log('[RemoteDev] Server port ' + port + ' is already used.');
        }
        resolve({ portAlreadyUsed: true, on: function(status, cb) { cb(); } });
      } else {
        if (logLevel >= LOG_LEVEL_INFO) {
          console.log('[RemoteDev] Start server...');
          console.log(repeat('-', 80) + '\n');
        }
        resolve(new SocketCluster(options));
      }
    });
  });
};
