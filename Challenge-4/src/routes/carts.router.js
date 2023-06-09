const express = require("express");
const { CartManager } = require("../CartManager");
const { ProductManager } = require("../ProductManager");

const cartManager = new CartManager();
const productManager = new ProductManager();

const router = express.Router();

// Crear un nuevo carrito
router.post("/", async (_, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ success: true, cart: newCart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al crear el carrito" });
  }
});

// Obtener los productos de un carrito
router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);
    if (cart) {
      res.status(200).json({ success: true, products: cart.products });
    } else {
      res.status(404).json({ success: false, error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error al obtener los productos del carrito",
    });
  }
});

// Agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const cart = await cartManager.getCartById(cartId);
    const product = await productManager.getProductById(productId);

    if (!cart || !product) {
      res
        .status(404)
        .json({ success: false, error: "Carrito o producto no encontrado" });
      return;
    }

    const existingProduct = cart.products.find((p) => p.product === productId);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cartManager.updateCart(cart);

    res.status(200).json({ success: true, cart: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error al agregar el producto al carrito",
    });
  }
});

module.exports = router;
