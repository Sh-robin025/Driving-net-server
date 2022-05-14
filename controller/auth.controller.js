const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const handleRegister = async (req, res, next) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const userData = { ...req.body, password: hashedPass };
    const response = await User.create(userData);

    let user = response.toObject();
    delete user.password;

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { handleRegister };
