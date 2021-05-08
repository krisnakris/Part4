const bcrypt = require('bcrypt');
const User = require('../models/user');

class UserController {
  static async getAllUsers(request, response) {
    const user = await User.find({});
    response.json(user);
  }

  static async postUsers(request, response) {
    const { body } = request;

    const saltRound = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRound);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });

    const savedUser = await user.save();
    response.json(savedUser);
  }
}

module.exports = UserController;
