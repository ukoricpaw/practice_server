const Router = require("express");
const ApiError = require("../error/ApiError");
const router = new Router();
const userService = require("../services/userService")
const checkAuthMiddleware = require(".././middlewares/checkAuthMiddleware")


router.post("/reg", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректные данные"));
    }
    const candidate = await userService.checkCandidate(email);
    if (candidate) {
      return next(ApiError.badRequest("Пользователь с таким email уже существует"));
    }
    const hashedPassword = await userService.hashPassword(password);
    const user = await userService.create(email, hashedPassword);
    const jwt = userService.jwtSign(user.id, email)
    return res.json({ token: jwt });
  }
  catch (err) {
    console.log(err)
    next(ApiError.badRequest("Ошибка запроса"))
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректные данные"));
    }
    const candidate = await userService.checkCandidate(email);
    if (!candidate) {
      return next(ApiError.badRequest("Пользователь с таким email не существует"));
    }
    const passwordValidation = userService.passwordCompare(password, candidate.password);
    if (!passwordValidation) {
      return next(ApiError.badRequest("Неверный пароль"));
    }
    const jwt = userService.jwtSign(candidate.id, email);
    res.json({ token: jwt })
  }
  catch (err) {
    console.log(err)
    next(ApiError.badRequest("Ошибка запроса"))
  }
})

router.get("/auth", checkAuthMiddleware, async (req, res, next) => {
  const token = userService.jwtSign(req.user.id, req.user.email);
  res.json({ token: token })
})

module.exports = router