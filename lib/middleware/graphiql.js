var graphiqlExpress = require('apollo-server').graphiqlExpress;

module.exports = graphiqlExpress({
  endpointURL: '/graphql',
  query:
  '{\n' +
  '  reports {\n' +
  '    id,\n' +
  '    type,\n' +
  '    title\n' +
  '  }\n' +
  '}'
});
