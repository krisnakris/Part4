const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const router = require('./routers');

// const blogSchema = new mongoose.Schema({
//   title : String,
//   author : String,
//   url : String,
//   likes : Number
// });

// const Blog = mongoose.model('Blog', blogSchema);

const mongoUrl = config.MONGODB_URI;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error => {
    logger.error('error connecting to MongoDB', error.message);
  }))

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use(router);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;