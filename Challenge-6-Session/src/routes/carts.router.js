const express = require("express");
const { CartManager } = require("../dao/CartManager");
const { ProductManager } = require("../dao/ProductManager");

const cartManager = new CartManager();
const productManager = new ProductManager();
const Cart = require("../dao/models/cart.model.js");
const Product = require("../dao/models/product.model.js");

const router = express.Router();

// const datos = require("../../data/cart-data.json");
// datos.forEach(async (dato) => {
//   try {
//     const addedCart = await Cart.create(dato);
//     console.log("Cart agregado:", addedCart);
//   } catch (error) {
//     console.error("Error al agregar el Cart:", error);
//   }
// });

// Crear un nuevo carrito
router.post("/", async (_, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    // Esto lo dejo solo para no eliminar filesystem por ser un requisito.. realmente no lo usaria
    const newCart2 = await cartManager.createCart(newCart._id.toString());
    res.status(201).json({ success: true, cart: newCart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al crear el carrito" });
  }
});

// Obtener los productos de un carrito (pasar por params el id)
router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await Cart.findById(cartId).populate("products.product");
    // Esto lo dejo solo para no eliminar filesystem por ser un requisito.. realmente no lo usaria
    const cart2 = await cartManager.getCartById(cartId);
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

// Agregar un producto al carrito (pasar por params los ids)
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid.toString();
    const productId = req.params.pid.toString();

    const cart = await Cart.findById(cartId);

    const cart2 = await cartManager.getCartById(cartId);
    const product2 = await productManager.getProductById(productId);

    if (!cart) {
      res.status(404).json({ success: false, error: "Carrito no encontrado" });
      return;
    }

    const product = await Product.findById(productId);

    if (!product || product.stock === 0) {
      res.status(404).json({ success: false, error: "Producto no encontrado o fuera de stock" });
      return;
    }

    const existingProductIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );
    if (existingProductIndex !== -1) {
      // mongoose devuelve -1 para documentos que no existan
      cart.products[existingProductIndex].quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    await cartManager.updateCart(cart2);

    res.status(200).json({ success: true, cart: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error al agregar el producto al carrito",
    });
  }
});

// Eliminar un producto del carrito (pasar por params los ids)
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid.toString();
    const productId = req.params.pid.toString();

    const cart = await Cart.findById(cartId);

    if (!cart) {
      res.status(404).json({ success: false, error: "Carrito no encontrado" });
      return;
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      res.status(200).json({ success: true, cart: cart });
    } else {
      res.status(404).json({
        success: false,
        error: "Producto no encontrado en el carrito",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error al eliminar el producto del carrito",
    });
  }
});

// Actualizar el carrito con un arreglo de productos (pasar por array de productos)
router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid.toString();
    const products = req.body.products;

    const cart = await Cart.findById(cartId);

    if (!cart) {
      res.status(404).json({ success: false, error: "Carrito no encontrado" });
      return;
    }

    cart.products = products;
    await cart.save();

    res.status(200).json({ success: true, cart: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el carrito",
    });
  }
});

// Actualizar la cantidad de un producto en el carrito (pasar por body la cantidad)
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid.toString();
    const productId = req.params.pid.toString();
    const quantity = req.body.quantity;

    const cart = await Cart.findById(cartId);

    if (!cart) {
      res.status(404).json({ success: false, error: "Carrito no encontrado" });
      return;
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      res.status(200).json({ success: true, cart: cart });
    } else {
      res.status(404).json({
        success: false,
        error: "Producto no encontrado en el carrito",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar la cantidad del producto en el carrito",
    });
  }
});

// Eliminar todos los productos del carrito (clear, pasar por params el id)
router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid.toString();

    const cart = await Cart.findById(cartId);

    if (!cart) {
      res.status(404).json({ success: false, error: "Carrito no encontrado" });
      return;
    }

    cart.products = [];
    await cart.save();

    res.status(200).json({ success: true, cart: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error al eliminar todos los productos del carrito",
    });
  }
});
module.exports = router;
