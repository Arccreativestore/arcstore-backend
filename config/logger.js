const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

// Create the Winston logger
const logger = createLogger({
    level: 'info', // Set the minimum log level (error, warn, info, http, verbose, debug, silly)
    format: combine(
        colorize(), // Colorize the output
        timestamp(), // Add timestamp to log messages
        logFormat // Use the custom log format
    ),
    transports: [
        // Write all logs with level `info` and below to `combined.log`
        new transports.File({ filename: 'logs/combined.log', level: 'info' }),

        // Write all logs with level `error` and below to `error.log`
        new transports.File({ filename: 'logs/error.log', level: 'error' }),

        // Write all logs to console
        new transports.Console()
    ]
});

// If in production, write logs to files only
if (process.env.NODE_ENV === 'production') {
    logger.remove(new transports.Console());
    logger.add(new transports.File({ filename: 'logs/combined.log' }));
    logger.add(new transports.File({ filename: 'logs/error.log', level: 'error' }));
}

module.exports = logger;
