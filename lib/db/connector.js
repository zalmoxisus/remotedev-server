var path = require('path');
var knexModule = require('knex');

module.exports = function connector(options) {
  var dbOptions = options.dbOptions;
  dbOptions.useNullAsDefault = true;
  if (!dbOptions.migrate) {
    return knexModule(dbOptions);
  }

  dbOptions.migrations = { directory: path.resolve(__dirname, 'migrations') };
  dbOptions.seeds = { directory: path.resolve(__dirname, 'seeds') };
  var knex = knexModule(dbOptions);

  knex.migrate.latest()
    .then(function() {
      return knex.seed.run();
    })
    .then(function() {
      console.log('Migrations are finished.');
    })
    .catch(function(error) {
      console.error(error);
    });

  return knexModule(dbOptions);
};
