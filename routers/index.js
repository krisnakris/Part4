const router = require('express').Router();
const blogsRouter = require('./blogsRouter');
const userRouter = require('./usersRouter');
const loginRouter = require('./loginRouter');

router.use('/api/blogs', blogsRouter);
router.use('/api/users', userRouter);
router.use('/api/login', loginRouter);

module.exports = router;
