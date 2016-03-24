var path = require('path');
var app = require('express')();

module.exports.run = function(worker) {
  var httpServer = worker.httpServer;
  var scServer = worker.scServer;

  httpServer.on('request', app);

  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, '..', 'views'));
  
  app.get('/', function(req, res) {
    res.render('index', { port: worker.options.port });
  });
  app.post('/', function(req, res) {
    if (!req.body.data) return res.status(404).end();
    scServer.exchange.publish('log', req.body.data);
    res.send('OK');
  });

  scServer.addMiddleware(scServer.MIDDLEWARE_EMIT, function (req, next) {
    var channel = req.event;
    var data = req.data;
    if (channel.substr(0, 3) === 'sc-' || channel === 'respond' || channel === 'log') {
      scServer.exchange.publish(channel, data);
    } else if (channel === 'log-noid') {
      scServer.exchange.publish('log', { id: req.socket.id, data: data });
    }
    next();
  });

  scServer.on('connection', function(socket) {
    socket.on('login', function (credentials, respond) {
      var channelName = credentials === 'master' ? 'respond' : 'log';
      worker.exchange.subscribe('sc-' + socket.id).watch(function(msg) {
        socket.emit(channelName, msg);
      });
      respond(null, channelName);
    });
    socket.on('disconnect', function() {
      var channel = worker.exchange.channel('sc-' + socket.id);
      channel.unsubscribe(); channel.destroy();
      scServer.exchange.publish('log', { id: socket.id, type: 'DISCONNECTED' });
    });
  });
};
