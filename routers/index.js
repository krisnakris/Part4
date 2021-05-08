const router = require('express').Router();
const blogsRouter = require('./blogsRouter');
const userRouter = require('./usersRouter');

router.use('/api/blogs', blogsRouter);
router.use('/api/users', userRouter);

module.exports = router;
