Appium Mac Driver
===================

[![Greenkeeper badge](https://badges.greenkeeper.io/appium/appium-mac-driver.svg)](https://greenkeeper.io/)

Appium Mac Driver is a test automation tool for Mac apps

**Please consider switching to [appium-mac2-driver](https://github.com/appium/appium-mac2-driver) for over macOS 10.15**

**The Appium team will not contribute to this driver**


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
|`system_shell`|Allows to execute shell scripts on the same machine. Read [appium-mac-driver#38](https://github.com/appium/appium-mac-driver/pull/38) for more details on the implementation |

## Desired Capabilities

Should be same for [Appium](https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/caps.md)

Differences are noted here:

### Handling Appium for mac


|Capability|Description|Values|
|----------|-----------|------|
| `a4mHost` | Specify the host name to the app for mac application. Defaults to `127.0.0.1` | e.g., `localhost` |
| `a4mPort` | Specify the port to the app for mac application. Defaults to `4622` | e.g, `4622`, `8080` |
| `a4mAppPath` | Specify the path to the app for mac application. It helps to launch `AppiumForMac` application in a custom path. Defaults to `/Applications/AppiumForMac.app` | e.g, `/Applications/CustomAppiumForMac.app` |
| `killAllA4MAppBeforeStart` | Kill all running processes named `AppiumForMac` not to remain the process in next Appium session run. Please disable this value when you run multiple `AppiumForMac` on the same machine. Defaults to `true` | `false`, `true` |
| `cookies` | Set propertires for [appium-for-mac](https://github.com/appium/appium-for-mac). Please read [this section](https://github.com/appium/appium-for-mac#new-session-properties) for more details. | `[{'name': 'implicit_timeout', 'value': 20.5}]` |

### Customize the port of AppiumForMac / Run tests in parallel

You can launch multiple `AppiumForMac` on a same machine to run tests in parallel.
Please consider to set `a4mPort`, `a4mAppPath` and `killAllA4MAppBeforeStart` as their capabilities to handle multiple Appium sessions on the same machine.
You must modify [the port number in appium-for-mac](https://github.com/appium/appium-for-mac/blob/2356957dc73b6275262c918ca8f4184ef4a25af0/AppiumForMac/AppiumForMacAppDelegate.m#L36) and build the app to coordinate the port number on `AppiumForMac`. Appium-mac-driver tries to establish a session to the host/port referencing `a4mPort` and `a4mAppPath`.
Do not forget to handle your test scenarios properly not to conflict each other since scenarios run on the same machine.
