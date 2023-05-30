const express = require("express");
const { ProductManager } = require("../ProductManager");
const manager = new ProductManager();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await manager.getAllProducts(limit);
    res.status(200).json({ success: true, products: products });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await manager.getProductById(productId);
    if (product) {
      res.status(200).json({
        success: true,
        product: product,
      });
    } else {
      res.status(404).json({ success: false, error: "Producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener el producto" });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = req.body;
    const addedProduct = await manager.addProduct(product);
    res.status(201).json({
      success: true,
      product: addedProduct,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Error al agregar el producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const updatedFields = req.body;
    const updatedProduct = await manager.updateProduct(id, updatedFields);
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const deletedProduct = await manager.deleteProductById(id);
    res.status(200).json({ success: true, product: deletedProduct });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar el producto" });
  }
});
module.exports = router;
