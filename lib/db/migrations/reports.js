exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('remotedev_reports', function(table) {
      table.uuid('id').primary();
      table.string('type');
      table.string('title');
      table.string('description');
      table.string('action');
      table.text('payload');
      table.text('preloadedState');
      table.text('screenshot');
      table.string('userAgent');
      table.string('version');
      table.string('user');
      table.string('userId');
      table.string('meta');
      table.string('exception');
      table.timestamp('added');
      table.uuid('appId')
        .references('id')
        .inTable('remotedev_apps');
    }),
    
    knex.schema.createTable('remotedev_payloads', function(table){
      table.uuid('id').primary();
      table.text('state');
      table.text('action');
      table.timestamp('added');
      table.uuid('reportId')
        .references('id')
        .inTable('remotedev_reports');
    }),

    knex.schema.createTable('remotedev_apps', function(table){
      table.uuid('id').primary();
      table.string('title');
      table.string('description');
      table.string('url');
      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('remotedev_reports'),
    knex.schema.dropTable('remotedev_apps')
  ])
};
