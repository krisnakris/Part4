const router = require('express').Router();
const blogsRouter = require('./blogsRouter');

router.use('/api/blogs',blogsRouter);

module.exports = router;
