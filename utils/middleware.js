const logger = require('./logger');

const requestLogger = (req, res, next) => {
  logger.info('Method ', req.method);
  logger.info('Path ', req.path);
  logger.info('Body ', req.body);
  logger.info('----');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint ' });
};

// eslint-disable-next-line consistent-return
const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === 'CaseError' && error.kind === 'ObjectId') {
    return res.status(400).json({ error: 'malformated id' });
  } if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  unknownEndpoint, errorHandler, requestLogger,
};
