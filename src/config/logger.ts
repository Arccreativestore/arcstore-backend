import {  createLogger, format, transports } from 'winston'
const { combine, timestamp, printf, colorize } = format;


const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});


export const logger = createLogger({
    level: 'info',
    format: combine(
        colorize(), 
        timestamp(), 
        logFormat
    ),
    transports: [
        
        new transports.File({ filename: 'src/logs/combined.log', level: 'info' }),
        new transports.File({ filename: 'src/logs/error.log', level: 'error' }),
        new transports.Console()
    ]
});


 if (process.env.NODE_ENV === 'production') {
     logger.remove(new transports.Console());
     logger.add(new transports.File({ filename: 'logs/combined.log' }));
     logger.add(new transports.File({ filename: 'logs/error.log', level: 'error' }));
 }


