var uuid = require('node-uuid');
var pick = require('lodash/pick');
var JSData = require('js-data');
var getAdapter = require('./adapter');

var store;
var adapter;
var Report;

var baseFields = ['id', 'title', 'added'];

function error(msg) {
  return new Promise(function(resolve, reject) {
    return resolve({ error: msg });
  });
}

function map(data, fields) {
  if (!fields) return data;
  return data.map(function(r) {
    return pick(r, fields);
  });
}

function listEvery(query) {
  if (!adapter) {
    return new Promise(function(resolve) {
      var report = Report.filter(query);
      return resolve(report);
    });
  }
  return Report.findAll(query);
}

function list(query, fields) {
  return new Promise(function(resolve) {
    listEvery(query).then(function(data) {
      return resolve(map(data, fields || baseFields));
    });
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
  if (data.type !== 'ACTIONS' && data.type !== 'STATE') {
    return error('Type ' + data.type + ' is not supported yet.');
  }

  var obj = {
    id: uuid.v4(),
    type: data.type,
    title: data.title || data.exception && data.exception.message || data.action,
    description: data.description,
    action: data.action,
    payload: data.payload,
    preloadedState: data.preloadedState,
    screenshot: data.screenshot,
    version: data.version,
    appId: data.appId,
    userAgent: data.userAgent,
    user: data.user,
    userId: typeof data.user === 'object' ? data.user.id : data.user,
    meta: data.meta,
    exception: data.exception,
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

function byBaseFields(data) {
  return pick(data, baseFields);
}

function createStore(options) {
  var adapterName = options.adapter;
  store = new JSData.DS();

  if (adapterName) {
    var DSAdapter = getAdapter(adapterName);
    adapter = new DSAdapter(options.dbOptions);
    store.registerAdapter(adapterName, adapter, { default: true });
  }

  Report = store.defineResource('report');

  return {
    list: list,
    get: get,
    add: add,
    selectors: {
      byBaseFields: byBaseFields
    }
  };
}

module.exports = createStore;
