var assign = require('object-assign');
var repeat = require('repeat-string');
var getOptions = require('./getOptions');
var getPort = require('getport');

module.exports = function(argv) {
  var SocketCluster = require('socketcluster').SocketCluster;
  var options = assign(getOptions(argv), {
    workerController: __dirname + '/worker.js',
    allowClientPublish: false
  });
  var port = options.port;
  return new Promise(function(resolve) {
    // Check port already used
    getPort(port, function(err, p) {
      if (err) return console.error(err);
      if (port !== p) {
        console.log('[RemoveDev] Server port ' + port + ' is already used.');
        resolve({ portAlreadyUsed: true, on: function(status, cb) { cb(); } });
      } else {
        console.log('[RemoveDev] Start server...');
        console.log(repeat('-', 80) + '\n');
        resolve(new SocketCluster(options));
      }
    });
  });
};
