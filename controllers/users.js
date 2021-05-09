const bcrypt = require('bcrypt');
const User = require('../models/user');

class UserController {
  static async getAllUsers(request, response) {
    const user = await User.find({});
    response.json(user);
  }

  static async postUsers(request, response) {
    const { body } = request;

    if (body.password && body.password.length < 3) {
      response.status(400).json({
        error: 'password must be at least 3 char',
      });
    } else if (!body.password) {
      response.status(401).jseon({
        error: 'password cannot be null',
      });
    }

    const saltRound = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRound);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });

    const savedUser = await user.save();
    response.send(savedUser);
  }
}

module.exports = UserController;
