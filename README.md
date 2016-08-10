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

### Inject to React Native local server

##### Add in your React Native app's `package.json`:

```
"scripts": {
  "remotedev": "remotedev --hostname=localhost --port=8000 --injectserver=reactnative"
}
```

The `injectserver` value can be `reactnative` or `macos` ([react-native-macos](https://github.com/ptmt/react-native-macos)), it used `reactnative` by default.

Then, we can start React Native server and RemoteDev server with one command:

![Inject server](https://cloud.githubusercontent.com/assets/3001525/16925822/92b6b3ac-4d58-11e6-9f36-d57dac8892c4.png)

##### Revert the injection

Add in your React Native app's `package.json`:

```
"scripts": {
  "remotedev-revert": "remotedev --revert=reactnative"
}
```

Or just run `$(npm bin)/remotedev --revert`.

### Connect from Android device or emulator

If you're running an Android 5.0+ device connected via USB or an Android emulator, use [adb command line tool](http://developer.android.com/tools/help/adb.html) to setup port forwarding from the device to your computer:

```
adb reverse tcp:8000 tcp:8000
```

If you're still use Android 4.0, you should use `10.0.2.2` (Genymotion: `10.0.3.2`) instead of `localhost` in [remote-redux-devtools](https://github.com/zalmoxisus/remote-redux-devtools#storeconfigurestorejs) or [remotedev](https://github.com/zalmoxisus/remotedev#usage).

### License

MIT
