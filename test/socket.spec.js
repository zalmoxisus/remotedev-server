var childProcess = require('child_process');
var request = require('supertest');
var expect = require('expect');
var scClient = require('socketcluster-client');
var remotedev = require('../');

describe('Server', function() {
  var scServer;
  this.timeout(5000);
  before(function(done) {
    scServer = childProcess.fork(__dirname + '/../bin/remotedev.js');
    setTimeout(done, 2000);
  });

  after(function() {
    if (scServer) {
      scServer.kill();
    }
  });

  describe('Express backend', function() {
    it('loads main page', function(done) {
      request('http://localhost:8000')
        .get('/')
        .expect('Content-Type', /text\/html/)
        .expect(200)
        .expect(function(res) {
          expect(res.text).toMatch(/<title>RemoteDev<\/title>/);
        })
        .end(done);
    });

    it('resolves an inexistent url', function(done) {
      request('http://localhost:8000/jreerfr/123')
        .get('/')
        .expect('Content-Type', /text\/html/)
        .expect(200, done);
    });
  });
});
