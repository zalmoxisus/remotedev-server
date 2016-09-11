function getAdapter(adapter) {
  return require('js-data-' + adapter);
}

module.exports = getAdapter;
