import logger from 'winston';

const level = 'debug';

logger.configure({
  level,
  format: logger.format.combine(
    logger.format.errors({ stack: true }),
    logger.format.colorize(),
    logger.format.timestamp(),
    logger.format.prettyPrint()
  ),
  defaultMeta: { service: 'logixboard-backend' },
  transports: [
    new logger.transports.Console({
      format: logger.format.simple(),
    })
  ],
});

export default logger;
