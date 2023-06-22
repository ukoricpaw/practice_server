const { User } = require('../models/models')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
require("dotenv").config();

class UserService {

  jwtSign(id, email) {
    return jwt.sign({ id, email }, process.env.SECRET_KEY, { expiresIn: "24h" });
  }

  passwordCompare(password, hashedPassword) {
    const passwordValidation = bcrypt.compareSync(password, hashedPassword);
    return passwordValidation
  }

  async hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 5);
    return hashedPassword;
  }

  async checkCandidate(email) {
    const candidate = await User.findOne({ where: { email } });
    return candidate
  }

  async create(email, password) {
    const user = await User.create({ email, password });
    return user;
  }
}

module.exports = new UserService();
