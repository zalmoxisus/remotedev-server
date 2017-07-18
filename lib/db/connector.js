var path = require('path');
var knexModule = require('knex');
var createTables = require('./migrations');
var defaultData = require('./seeds');

module.exports = function connector(options) {
  var dbOptions = options.dbOptions;
  dbOptions.useNullAsDefault = true;
  if (!dbOptions.migrate)
  {
      var knex = knexModule(dbOptions);
      knex.schema.hasTable('remotedev_reports').then(function (exists) {
          if (!exists) {
              createTables.up(knex, Promise).then(function () {
                  defaultData.seed(knex, Promise).then(function () {
                      console.log('   \x1b[0;32m[Done]\x1b[0m Tables are created\n');
                  });
              });
          }
      });
    return knex;
  }

  dbOptions.migrations = { directory: path.resolve(__dirname, 'migrations') };
  dbOptions.seeds = { directory: path.resolve(__dirname, 'seeds') };
  var knex = knexModule(dbOptions);

  knex.migrate.latest()
    .then(function() {
      return knex.seed.run();
    })
    .then(function() {
      console.log('   \x1b[0;32m[Done]\x1b[0m Migrations are finished\n');
    })
    .catch(function(error) {
      console.error(error);
    });

  return knex;
};
