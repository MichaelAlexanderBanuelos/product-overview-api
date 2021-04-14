const express = require("express");
const controllers = require("./controllers.js");

const router = express.Router();

router.route("/products").get(controllers.allProducts);

router.route("/products/:product_id").get(controllers.getProduct);

router.route("/products/:product_id/styles").get(controllers.getStyles);

router.route("/products/:product_id/related").get(controllers.getRelated);

module.exports = router;
