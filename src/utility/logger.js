import path from 'path';
import winston from 'winston';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const logDirectory = path.join(process.cwd(), 'logs');
const logLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  colors: {
    fatal: 'red',
    error: 'yellow',
    warn: 'orange',
    info: 'green',
    debug: 'blue',
    trace: 'cyan',
  },
};


const transports = [
 
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', 
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),

  new winston.transports.File({
    level: 'error',  
    filename: path.join(logDirectory, 'error.log'),
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
  new winston.transports.File({
    level: 'info',
    filename: path.join(logDirectory, 'combined.log'),
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),

  // External logging services (example: Loggly, Datadog, etc.)
  // new winston.transports.Http({
  //   level: 'info',
  //   format: winston.format.json(),
  //   host: 'your-external-service-url',
  //   path: '/log-endpoint',
  // }),
];

// Create the logger
const logger = winston.createLogger({
  levels: logLevels.levels,
  transports: transports,
  exitOnError: false,  // Don't exit the process on logging errors
});

// Optionally, add color to the console output based on log level
winston.addColors(logLevels.colors);

// Add a custom format for the logs
logger.format = winston.format.combine(
  winston.format.label({ label: 'Application' }),
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message, label }) => {
    return `[${timestamp}] [${label}] [${level}]: ${message}`;
  })
);

// Example usage:
logger.fatal('This is a fatal log.');
logger.error('This is an error log.');
logger.warn('This is a warning log.');
logger.info('This is an info log.');
logger.debug('This is a debug log.');
logger.trace('This is a trace log.');

export default logger;
