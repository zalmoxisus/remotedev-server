module.exports = function(argv) {
  var SocketCluster = require('socketcluster').SocketCluster;

  var socketCluster = new SocketCluster({
    host: argv.hostname || null,
    port: Number(argv.port) || 8000,
    workerController: __dirname + '/worker.js',
    allowClientPublish: false
  });
};
