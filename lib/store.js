var uuid = require('node-uuid');
var pick = require('lodash/pick');
var connector = require('./db/connector');

var reports = 'remotedev_reports'; 
// var payloads = 'remotedev_payloads';
var knex;

var baseFields = ['id', 'title', 'added'];

function error(msg) {
  return new Promise(function(resolve, reject) {
    return resolve({ error: msg });
  });
}

function list(query, fields) {
  var r = knex.select(fields || baseFields).from(reports);
  if (query) return r.where(query);
  return r;
}

function get(id) {
  if (!id) return error('No id specified.');

  return knex(reports).where('id', id);
}

function add(data) {
  if (!data.type || !data.payload) {
    return error('Required parameters aren\'t specified.');
  }
  if (data.type !== 'ACTIONS' && data.type !== 'STATE') {
    return error('Type ' + data.type + ' is not supported yet.');
  }

  var added = Date.now(); 
  var reportId = uuid.v4();
  var report = {
    id: reportId,
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
    added: added
  };
  /*
  var payload = {
    id: uuid.v4(),
    reportId: reportId,
    state: data.payload,
    added: added
  };
  */

  return knex.insert(report).into(reports)
    .then(function (){ return byBaseFields(report); })
}

function byBaseFields(data) {
  return pick(data, baseFields);
}

function createStore(options) {
  knex = connector(options);

  return {
    list: list,
    get: get,
    add: add
  };
}

module.exports = createStore;
