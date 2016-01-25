RemoteDev Server
================

Bridge for connecting [remotedev monitor app](https://github.com/zalmoxisus/remotedev-app) with [Remote Redux DevTools](https://github.com/zalmoxisus/remote-redux-devtools) or [RemoteDev](https://github.com/zalmoxisus/remotedev) using a local server. Running a local server is optional, you may use [remotedev.io](remotedev.io) server instead, which is by default.

### Installation

```
npm install --save-dev remotedev-server
```

### Usage

Add in your app's `package.json`:

```
"scripts": {
  "remotedev": "remotedev --hostname=localhost --port=8000"
}
```

So, you can start local server by running `npm run remotedev`.

If you install the package globally (not recommended) just run:

```
remotedev --hostname=localhost --port=8000
```

Change `hostaname` and `port` to the values you want.

### Connect from Android device or emulator

If you're running an Android 5.0+ device connected via USB or an Android emulator, use [adb command line tool](http://developer.android.com/tools/help/adb.html) to setup port forwarding from the device to your computer:

```
adb reverse tcp:8000 tcp:8000
```

If you're still use Android 4.0, you should use `10.0.2.2` (Genymotion: `10.0.3.2`) instead of `localhost` in [remote-redux-devtools](https://github.com/zalmoxisus/remote-redux-devtools#storeconfigurestorejs) or [remotedev](https://github.com/zalmoxisus/remotedev#usage).

### License

MIT
