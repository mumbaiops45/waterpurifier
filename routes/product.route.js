const express = require("express");
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getMyProducts, } = require("../controller/product.controller");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createProduct);

router.get("/", getAllProducts);
router.get("/my-products", authMiddleware, getMyProducts);

router.get("/:id", getProductById);

router.put("/:id", authMiddleware, updateProduct);

router.delete("/:id", authMiddleware, deleteProduct);


module.exports = router;