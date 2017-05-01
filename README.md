Appium Mac Driver
===================

Appium Mac Driver is a test automation tool for Mac aps


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
gulp
```

## Test


You can run unit and e2e tests:


```
// unit tests:
gulp once

// e2e tests
gulp e2e-test
```
