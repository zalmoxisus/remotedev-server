var uuid = require('node-uuid');
var JSData = require('js-data');

var store;
var adapter;
var Report;

function error(msg) {
  return new Promise(function(resolve, reject) {
    return resolve({ error: msg });
  });
}

function get(id) {
  if (!id) return error('No id specified.');

  if (!adapter) {
    return new Promise(function(resolve) {
      var report = Report.get(id);
      return resolve(report);
    });
  }
  return Report.find(id);
}

function add(data) {
  if (!data.type || !data.payload) {
    return error('Required parameters aren\'t specified.');
  }
  
  var obj = {
    id: uuid.v4(),
    type: data.type,
    title: data.title,
    description: data.description,
    failed: data.failed,
    payload: data.payload,
    screen: data.screen,
    user: data.user,
    isLog: !!data.isLog,
    added: Date.now()
  };

  if (!adapter) {
    return new Promise(function(resolve) {
      var report = Report.inject(obj);
      return resolve(report);
    });
  }
  return Report.create(obj);
}

function createStore(options) {
  store = new JSData.DS();
  Report = store.defineResource('report');

  return {
    get: get,
    add: add
  };
}

module.exports = createStore;
