const router = require('express').Router();
const blogsRouter = require('./blogsRouter');
const userRouter = require('./usersRouter');
const loginRouter = require('./loginRouter');
const middleware = require('../utils/middleware');

router.use('/api/users', userRouter);
router.use('/api/login', loginRouter);
router.use(middleware.tokenExtractor);
router.use('/api/blogs', blogsRouter);

module.exports = router;
