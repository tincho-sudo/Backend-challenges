const express = require("express");
const router = express.Router();
const { uploader } = require("../utils.js");
const Product = require("../dao/models/product.model.js");

router.get(
  "/",
  async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 0;
      const products = await Product.find().limit(limit);
      req.products = products; // Asignar los productos
      next(); // Pasar al siguiente manejador de ruta (views.router.js)
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, error: "Error al obtener los productos" });
    }
  },
  (req, res) => {
    // Se ejecuta despues del next
    const products = req.products;
    res.status(200).json({ success: true, products: products });
  }
);

router.get("/:pid", async (req, res) => {
  try {
    const manager = req.manager;
    const productId = req.params.pid;
    const product2 = await manager.getProductById(productId);
    // Esto lo dejo solo para no eliminar filesystem por ser un requisito.. realmente no lo usaria
    const product = await Product.findById(productId);
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

router.post("/", uploader.single("thumbnail"), async (req, res) => {
  try {
    const manager = req.manager;
    const product = req.body;

    const thumbnail = req.file ? req.file.filename : null;
    product.thumbnail = thumbnail;

    const addedProduct = await Product.create(product);
    const productId = addedProduct._id.toString();

    // Esto lo dejo solo para no eliminar filesystem por ser un requisito.. realmente no lo usaria
    const addedProductFS = await manager.addProduct(product, productId);

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

router.put("/:pid", uploader.single("thumbnail"), async (req, res) => {
  try {
    const manager = req.manager;
    const id = req.params.pid;
    const updatedFields = req.body;
    const thumbnail = req.file ? req.file.filename : null;
    updatedFields.thumbnail = thumbnail;
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    // Esto lo dejo solo para no eliminar filesystem por ser un requisito.. realmente no lo usaria
    const updatedProduct2 = await manager.updateProduct(id, updatedFields);

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
    const manager = req.manager;
    const id = req.params.pid;
    // Esto lo dejo solo para no eliminar filesystem por ser un requisito.. realmente no lo usaria
    const deletedProduct2 = await manager.deleteProductById(id);
    const deletedProduct = await Product.findByIdAndDelete(id);

    res.status(200).json({ success: true, product: deletedProduct });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar el producto" });
  }
});

module.exports = router;
