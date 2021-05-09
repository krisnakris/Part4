const userRouter = require('express').Router();
const userController = require('../controllers/users');

userRouter.get('/', userController.getAllUsers);
userRouter.post('/', userController.postUsers);

module.exports = userRouter;
