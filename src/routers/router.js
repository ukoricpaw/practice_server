const Router = require('express');
const router = new Router();
const productController = require("../controllers/productController")
const userController = require("../controllers/userController")

router.use("/product", productController)
router.use("/user", userController)

module.exports = router;