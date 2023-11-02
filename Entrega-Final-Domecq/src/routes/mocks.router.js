const express = require("express");
const router = express.Router();
const { getAllMocks } = require("../controllers/mock.controller");

router.get("/", getAllMocks, (req, res) => {
  // Se ejecuta despues del next
  const products = req.mockProducts;
  res.status(200).json({ success: true, mockProducts: products });
});

module.exports = router;
