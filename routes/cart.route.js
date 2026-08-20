const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, cartController.addToCart);

router.get("/", authMiddleware , cartController.getCart);

router.delete("/remove/:productId", authMiddleware, cartController.removeFromCart);

module.exports = router;