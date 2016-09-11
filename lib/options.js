module.exports = function getOptions(argv) {
  return {
    host: argv.hostname || process.env.npm_package_remotedev_hostname || null,
    port: Number(argv.port || process.env.npm_package_remotedev_port) || 8000,
    protocol: argv.protocol || process.env.npm_package_remotedev_protocol || 'http',
    protocolOptions: !(argv.protocol === 'https') ? null : {
      key: argv.key || process.env.npm_package_remotedev_key || null,
      cert: argv.cert || process.env.npm_package_remotedev_cert || null,
      passphrase: argv.passphrase || process.env.npm_package_remotedev_passphrase || null
    },
    adapter: argv.adapter || process.env.npm_package_remotedev_adapter,
    dbOptions: argv.dbOptions || process.env.npm_package_remotedev_db,
    logLevel: argv.logLevel || 3
  };
}
