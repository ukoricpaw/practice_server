const Router = require("express");
const router = new Router();
const checkAuthMiddleware = require("../middlewares/checkAuthMiddleware");
const ApiError = require("../error/ApiError");
const productService = require("../services/productService");

router.post("/", checkAuthMiddleware, async (req, res, next) => {
  try {
    const { name, price } = req.body;
    const { img } = req.files;
    if (!img || !name || !price) {
      return next(ApiError.badRequest("Некорректные данные"));
    }
    const product = await productService.create(name, price, img, req.user.id);
    res.json(product);
  } catch (err) {
    console.log(err);
    next(ApiError.badRequest("Ошибка запроса"));
  }
});

router.post("/chars/:id", checkAuthMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { characteristics } = req.body;
    if (!characteristics || !Array.isArray(characteristics)) {
      return next(ApiError.badRequest("Некорректные данные"));
    }
    const product = await productService.addChars(
      id,
      req.user.id,
      characteristics
    );
    if (!product) {
      console.log(product);
      return next(ApiError.badRequest("Ошибка запроса"));
    }
    res.json(product);
  } catch (err) {
    console.log(err);
    return next(ApiError.badRequest("Ошибка запроса"));
  }
});

router.get("/get/all", async (req, res, next) => {
  try {
    let { limit, page, sorted, search } = req.query;
    limit = limit || 10;
    page = page || 1;
    sorted = sorted || "ASC";
    search = search || "";
    const offset = limit * page - limit;
    const productsOfUser = await productService.getAllProducts(
      limit,
      offset,
      sorted,
      search
    );
    res.json(productsOfUser);
  } catch (err) {
    console.log(err);
    next(ApiError.badRequest("Ошибка запроса"));
  }
});

router.get("/getByUser/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("Не задан id"));
    }
    let { limit, page, sorted, search } = req.query;
    limit = limit || 10;
    page = page || 1;
    sorted = sorted || "ASC";
    search = search || "";
    const offset = limit * page - limit;
    if (!id) {
      return next(ApiError.badRequest("id не указан"));
    }
    const productsOfUser = await productService.userProducts(
      id,
      limit,
      offset,
      sorted,
      search
    );
    res.json(productsOfUser);
  } catch (err) {
    console.log(err);
    next(ApiError.badRequest("Ошибка запроса"));
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("id не указан"));
    }
    const product = await productService.getOneProduct(id);
    if (!product) {
      return next(ApiError.badRequest("Ошибка запроса"));
    }
    res.json(product);
  } catch (err) {
    next(ApiError.badRequest("Ошибка запроса"));
  }
});

router.put("/chars/:id", checkAuthMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("id не указан"));
    }
    const { name, value } = req.body;
    const chars = await productService.updateCharacteristic(
      id,
      req.user.id,
      name,
      value
    );
    if (!chars) {
      return next(ApiError.badRequest("Ошибка запроса"));
    }
    res.json(chars);
  } catch (err) {
    next(ApiError.badRequest("Ошибка запроса"));
  }
});

router.delete("/chars/:id", checkAuthMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("id не указан"));
    }
    const result = await productService.deleteProduct(id, req.user.id);
    if (!result) {
      return next(ApiError.badRequest("Ошибка запроса"));
    }
    return res.json(result);
  } catch (err) {
    next(ApiError.badRequest("Ошибка запроса"));
  }
});

router.put("/:id", checkAuthMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("id не указан"));
    }
    const { name, price } = req.body;

    const product = await productService.updateProduct(
      id,
      req.user.id,
      name,
      req.files,
      price
    );
    if (!product) {
      return next(ApiError.badRequest("Ошибка запроса"));
    }
    res.json(product);
  } catch (err) {
    console.log(err);
    next(ApiError.badRequest("Ошибка запроса"));
  }
});
router.delete("/:id", checkAuthMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("id не указан"));
    }
    const result = await productService.deleteProduct(id, req.user.id);
    if (!result) {
      return next(ApiError.badRequest("Ошибка запроса"));
    }
    return res.json(result);
  } catch (err) {
    next(ApiError.badRequest("Ошибка запроса"));
  }
});

module.exports = router;
