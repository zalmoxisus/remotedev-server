RemoteDev Server
================

Bridge for connecting [remotedev monitor app](https://github.com/zalmoxisus/remotedev-app) with [Remote Redux DevTools](https://github.com/zalmoxisus/remote-redux-devtools) or [RemoteDev](https://github.com/zalmoxisus/remotedev) using a local server. Running a local server is optional, you may use [remotedev.io](remotedev.io) server instead, which is by default.

### Installation

```
npm install --save-dev remotedev-server
```

### Usage

##### Add in your app's `package.json`:

```
"scripts": {
  "remotedev": "remotedev --hostname=localhost --port=8000"
}
```

So, you can start local server by running `npm run remotedev`.

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

Change `hostname` and `port` to the values you want.

### License

MIT
