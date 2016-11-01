RemoteDev Server
================

Bridge for communicating with an application remotely via [Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension), [Remote Redux DevTools](https://github.com/zalmoxisus/remote-redux-devtools) or [RemoteDev](https://github.com/zalmoxisus/remotedev). Running your server is optional, you can use [remotedev.io](https://remotedev.io) instead.

### Installation

```
npm install --save-dev remotedev-server
```

Also [there's a docker image](https://github.com/jhen0409/docker-remotedev-server) you can use.

### Usage

##### Add in your app's `package.json`:

```
"scripts": {
  "remotedev": "remotedev --hostname=localhost --port=8000"
}
```

So, you can start remotedev server by running `npm run remotedev`.

##### Import in your `server.js` script you use for starting a development server:

```js
var remotedev = require('remotedev-server');
remotedev({ hostname: 'localhost', port: 8000 });
```

So, you can start remotedev server together with your dev server.

##### Install the package globally (not recommended) just run:

```
remotedev --hostname=localhost --port=8000
```

### Connection settings

Set `hostname` and `port` to the values you want. `hostname` by default is `localhost` and `port` is `8000`.

To use WSS, set `protocol` argument to `https` and provide `key`, `cert` and `passphrase` arguments.

### Inject to React Native local server

##### Add in your React Native app's `package.json`:

```
"scripts": {
  "remotedev": "remotedev --hostname=localhost --port=8000 --injectserver=reactnative"
}
```

The `injectserver` value can be `reactnative` or `macos` ([react-native-macos](https://github.com/ptmt/react-native-macos)), it used `reactnative` by default.

Then, we can start React Native server and RemoteDev server with one command (`npm start`).

##### Revert the injection

Add in your React Native app's `package.json`:

```
"scripts": {
  "remotedev-revert": "remotedev --revert=reactnative"
}
```

Or just run `$(npm bin)/remotedev --revert`.

### Connect from Android device or emulator

> Note that if you're using `injectserver` argument explained above, this step is not necessary. 

If you're running an Android 5.0+ device connected via USB or an Android emulator, use [adb command line tool](http://developer.android.com/tools/help/adb.html) to setup port forwarding from the device to your computer:

```
adb reverse tcp:8000 tcp:8000
```

If you're still use Android 4.0, you should use `10.0.2.2` (Genymotion: `10.0.3.2`) instead of `localhost` in [remote-redux-devtools](https://github.com/zalmoxisus/remote-redux-devtools#storeconfigurestorejs) or [remotedev](https://github.com/zalmoxisus/remotedev#usage).

### Save reports and logs

You can store reports via [`redux-remotedev`](https://github.com/zalmoxisus/redux-remotedev) and get them replicated with [Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension) or [Remote Redux DevTools](https://github.com/zalmoxisus/remote-redux-devtools). You can get action history right in the extension just by clicking the link from a report.

Remotedev server is database agnostic. By default everything is stored in the memory, but you can persist data by specifying one of the jsData adapters above for `adapter` argument. Also you can add an `dbOptions` argument for database configuration. If not provided the default options will be used (for some adapters, like `sql`, it's required). You have to install the required adapter's npm package.

| Storage   | `adapter` | `dbOptions` argument example (optional)                                                                                | install                                              |
|-----------|-----------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------|
| Firebase  | firebase  | `{ basePath: 'https://my-app.firebase.io' }`                                                                           | `npm install --save js-data-firebase`                |
| HTTP      | http      | `{ basePath: 'https://my-rest-server/api' }`                                                                           | `npm install --save js-data-http`                    |
| LevelUp   | levelup   | `'./db'` (the levelup "db" object will be available at "adapter.db")                                                   | `npm install --save js-data-levelup`                 |
| MongoDB   | mongodb   | `{ name: 'user', idAttribute: '_id', table: 'users' }`                                                                 | `npm install --save js-data-mongodb`                 |
| MySQL     | sql       | `{ client: 'mysql', connection: { host: '123.45.67.890', user: 'ubuntu', password: 'welcome1234', database: 'db1' }`   | `npm install --save js-data-sql`                     |
| Postgres  | sql       | `{ client: 'pg', connection: { host: '123.45.67.890', user: 'ubuntu', password: 'welcome1234', database: 'db1' }`      | `npm install --save js-data-sql`                     |
| Redis     | redis     | See the configurable options for [`node_redis`](https://github.com/NodeRedis/node_redis)                               | `npm install --save js-data-redis`                   |
| RethinkDB | rethinkdb | `{ host: '123.456.68.987', db: 'my_db' }`                                                                              | `npm install --save rethinkdbdash js-data-rethinkdb` |
| SQLite3   | sql       | `{ client: 'sqlite3', connection: { host: '123.45.67.890', user: 'ubuntu', password: 'welcome1234', database: 'db1' }` | `npm install --save js-data-sql`                     |

Implement a [custom adapter for JSData](http://www.js-data.io/docs/working-with-adapters#custom-adapters).

### License 

MIT
