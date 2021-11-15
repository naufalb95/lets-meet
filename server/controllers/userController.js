const { User } = require("../models");
const { decode } = require("../helpers/bcrypt");
const { sign } = require("../helpers/jwt");

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const result = await User.create({ username, email, password });
      res.status(201).json({
        message: `Success create account, username: ${result.username}`,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const foundUser = await User.findOne({ where: { email } });
      if (!foundUser) throw { name: `failed login` };
      const isValid = decode(password, foundUser.password);
      if (!isValid) throw { name: `failed login` };
      const access_token = sign({
        id: foundUser.id,
        email: foundUser.email,
      });
      res.status(200).json({ access_token });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
