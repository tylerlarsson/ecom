const moment = require('moment-timezone');
const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');

const TIME_FORMAT = 'YY-MMM-DD HH:mm:ss z';
const timestamp = () => moment.tz(moment(), 'EST').format(TIME_FORMAT);

const CONSOLE_CONFIG = {
  json: false,
  handleExceptions: true,
  humanReadableUnhandledException: true,
  timestamp,
};
const FILE_CONFIG = {
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '1000m',
  maxFiles: '500d',
  timestamp,
};

function createLogger(filename) {
  // eslint-disable-next-line no-param-reassign
  filename += '-%DATE%.log';
  const fullFilename = path.join(process.cwd(), 'logs', filename);
  const winstonLogger = new winston.Logger({
    transports: [
      new winston.transports.Console(CONSOLE_CONFIG),
      new winston.transports.DailyRotateFile(
        Object.assign({ filename: fullFilename }, FILE_CONFIG),
      ),
    ],
  });

  winstonLogger.exitOnError = false;
  return winstonLogger;
}

function errorTransformer(errors) {
  return errors.map(error => {
    const { response } = error;
    const message =
      response &&
      response.body &&
      response.body.error &&
      response.body.error.message;
    return message || error;
  });
}

module.exports = function(name = 'define module') {
  const winstonLogger = createLogger(name);
  return {
    info(...text) {
      winstonLogger.info(`${name}:`, ...text);
    },

    error(...text) {
      // eslint-disable-next-line no-param-reassign
      text = errorTransformer(text);
      winstonLogger.error(`${name}:`, ...text);
    },
  };
};
