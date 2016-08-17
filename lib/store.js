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

function add(data) {
  if (!data.type || !data.payload) {
    return error('Required parameters aren\'t specified.');
  }
  
  var obj = {
    id: uuid.v4(),
    type: data.type,
    payload: data.payload
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
    add: add
  };
}

module.exports = createStore;
