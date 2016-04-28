module.exports = function(argv) {
  var SocketCluster = require('socketcluster').SocketCluster;

  return new SocketCluster({
    host: argv.hostname || null,
    port: Number(argv.port) || 8000,
    workerController: __dirname + '/worker.js',
    allowClientPublish: false,
    protocol: argv.protocol || 'http',
    protocolOptions: !(argv.protocol === 'https') ? null : {
      key: argv.key || null,
      cert: argv.cert || null,
      passphrase: argv.passphrase || null
    }
  });
};
