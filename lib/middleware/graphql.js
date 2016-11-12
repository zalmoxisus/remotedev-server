var apolloExpress = require('apollo-server').apolloExpress;
var schema = require('../api/schema');

module.exports = function (store) {
  return apolloExpress(function() {
    return {
      schema: schema,
      context: {
        store: store
      }
    };
  });
};
