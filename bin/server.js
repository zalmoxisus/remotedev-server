var assign = require('object-assign');
var getOptions = require('./getOptions');

module.exports = function(argv) {
  var SocketCluster = require('socketcluster').SocketCluster;
  var options = assign(getOptions(argv), {
    workerController: __dirname + '/worker.js',
    allowClientPublish: false
  });
  return new SocketCluster(options);
};
