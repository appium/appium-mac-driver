const desiredCapConstraints = {
  platformName: { // override
    presence: true,
    isString: true,
    inclusionCaseInsensitive: ['Mac']
  },
  app: {
    isString: true
  },
  deviceName: {
    presence: false
  },
  processArguments: {
    // recognize the cap,
    // but validate in the driver#validateDesiredCaps method
  },
  implicitTimeout: {
    isNumber: true
  },
  loopDelay: {
    isNumber: true
  },
  commandDelay: {
    isNumber: true
  },
  mouseMoveSpeed: {
    isNumber: true
  },
  diagnosticsDirectoryLocation: {
    isString: true
  },
  screenShotOnError: {
    isNumber: true
  },
  a4mHost: {
    isString: true
  },
  a4mPort: {
    isNumber: true
  },
  a4mAppPath: {
    isString: true
  },
  killAllA4MAppBeforeStart: {
    isBoolean: true
  }
};

export default desiredCapConstraints;
