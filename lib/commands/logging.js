import logger from '../logger';
import _ from 'lodash';

const GET_SERVER_LOGS_FEATURE = 'get_server_logs';

const extensions = {};

extensions.supportedLogTypes = {
  server: {
    description: 'Appium server logs',
    getter: (self) => {
      self.ensureFeatureEnabled(GET_SERVER_LOGS_FEATURE);
      return logger.unwrap().record
        .map(function (x) {
          return {
            // npmlog does not keep timestamps in the history
            timestamp: Date.now(),
            level: 'ALL',
            message: _.isEmpty(x.prefix) ? x.message : `[${x.prefix}] ${x.message}`,
          };
        });
    },
  },
};

Object.assign(extensions);

export default extensions;
