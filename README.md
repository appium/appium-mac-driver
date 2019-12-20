Appium Mac Driver
===================

[![Greenkeeper badge](https://badges.greenkeeper.io/appium/appium-mac-driver.svg)](https://greenkeeper.io/)

Appium Mac Driver is a test automation tool for Mac apps


## Installation
```
npm install appium-mac-driver
```

## Usage
Import Mac Driver, set [desired capabilities](https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/caps.md) and create a session:

```
import { MacDriver } from `appium-mac-driver`

let defaultCaps = {
  platformName: 'Mac'
};

let driver = new MacDriver();
await driver.createSession(defaultCaps);
```

## Watch code for changes, re-transpile and run unit tests:

```
npm run test
```

## Test

You can run unit and e2e tests:

```
// unit tests:
npm run test

// e2e tests
npm run e2e-test
```

## Opt-In Features (With Security Risk)
These can be enabled when running this driver through Appium, via the `--allow-insecure` or `--relaxed-security` flags.

|Feature Name|Description|
|------------|-----------|
|`system_shell`|Allows to execute shell scripts on the machine. Read [appium-mac-driver#38](https://github.com/appium/appium-mac-driver/pull/38) for more details on the implementation |
