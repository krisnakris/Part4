const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');

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

  switch (error.name) {
    case 'CastError':
      return res.status(400).send({ error: 'malformated id' });
    case 'ValidationError':
      return res.status(400).json({ error: error.message });
    case 'JsonWebTokenError':
      return res.status(401).json({ error: 'invalid token' });
    case 'TokenExpiredError':
      return res.status(401).json({ error: 'token expired' });
    default:
      break;
  }

  logger.error(error.message);
  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!request.token || !decodedToken) {
    response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);
  request.user = user;
  next();
};

module.exports = {
  unknownEndpoint, errorHandler, requestLogger, tokenExtractor, userExtractor,
};
