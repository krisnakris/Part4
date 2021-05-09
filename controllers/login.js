const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

class LoginController {
  static async login(requset, response) {
    const { body } = requset;

    const user = await User.findOne({ username: body.username });
    const isPasswordCorrect = user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

    if (!(user && isPasswordCorrect)) {
      response.status(401).json({
        error: 'invalid username or password',
      });
    }

    const userForToken = {
      username: user.username,
      // eslint-disable-next-line no-underscore-dangle
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    response
      .status(200)
      .send({ token, username: user.username, name: user.name });
  }
}

module.exports = LoginController;
