var appRoot = require('app-root-path')
var morgan = require('morgan');

var tsFormat = () => (new Date().toLocaleTimeString())
const winston = require('winston');
var options = {
    file: {
      level: 'info',
      filename: `${appRoot}/log-history.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      timestamp: true,
      colorize: false,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    },
  };

const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
      ],
      exitOnError: false, // do not exit on handled exceptions
});   

logger.stream = {
    write: function(message, encoding) {
      logger.info(message);
    },
  };
  

module.exports = logger;