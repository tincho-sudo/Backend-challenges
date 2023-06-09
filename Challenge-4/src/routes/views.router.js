const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const manager = req.manager;
    const products = await manager.getAllProducts();
    res.render("home", { products, title: "Home" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los productos" });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const manager = req.manager;
    const products = await manager.getAllProducts();
    res.render("realTimeProducts", { products, title: "RealTimeProducts" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los productos" });
  }
});

module.exports = router;
