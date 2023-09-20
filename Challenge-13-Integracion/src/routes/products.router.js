const express = require("express");
const router = express.Router();
const { uploader } = require("../utils.js");

const {
  getAllProducts,
  getProductById,
  newProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller.js");

router.get("/", getAllProducts, (req, res) => {
  // Se ejecuta despues del next
  const products = req.products;
  res.status(200).json({ success: true, products: products });
});

router.get("/:pid", getProductById);

router.post("/", uploader.single("thumbnail"), newProduct);

router.put("/:pid", uploader.single("thumbnail"), updateProduct);

router.delete("/:pid", deleteProduct);

module.exports = router;
