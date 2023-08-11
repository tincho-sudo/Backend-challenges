const express = require("express");
const router = express.Router();

const {
  newCart,
  getCartById,
  addProductToCartById,
  deleteProductFromCartById,
  updateCartById,
  updateProductFromCartById,
  clearCart,
} = require("../controllers/carts.controller");

// Crear un nuevo carrito
router.post("/", newCart);

// Obtener los productos de un carrito (pasar por params el id)
router.get("/:cid", getCartById);

// Agregar un producto al carrito (pasar por params los ids)
router.post("/:cid/product/:pid", addProductToCartById);

// Eliminar un producto del carrito (pasar por params los ids)
router.delete("/:cid/products/:pid", deleteProductFromCartById);

// Actualizar el carrito con un arreglo de productos (pasar por array de productos)
router.put("/:cid", updateCartById);

// Actualizar la cantidad de un producto en el carrito (pasar por body la cantidad)
router.put("/:cid/products/:pid", updateProductFromCartById);

// Eliminar todos los productos del carrito (clear, pasar por params el id)
router.delete("/:cid", clearCart);
module.exports = router;
