const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const router = require('./routers');

const app = express();

const mongoUrl = config.MONGODB_URI;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
})
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch(((error) => {
    logger.error('error connecting to MongoDB', error.message);
  }));

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use(router);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
