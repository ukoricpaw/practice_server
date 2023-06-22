const jwt = require("jsonwebtoken")
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      next();
    }
    else {
      const token = req.headers.authorization.split(" ")[1] //Bearer token;
      if (!token) {
        return res.status(401).json({ message: "Пользователь не авторизован" })
      }
      const verified = jwt.verify(token, process.env.SECRET_KEY)
      req.user = verified;
      next();
    }
  }
  catch (err) {
    return res.status(401).json({ message: "Пользователь не авторизован" })
  }
}