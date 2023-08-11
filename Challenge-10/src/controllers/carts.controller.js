const { CartManager } = require("../dao/CartManager");
const { ProductManager } = require("../dao/ProductManager");
const cartManager = new CartManager();
const productManager = new ProductManager();

const CartsService = require("../services/carts.service");
const ProductsService = require("../services/products.service");
const cartsService = new CartsService();
const productsService = new ProductsService();

const newCart = async (_, res) => {
  try {
    const newCart = await cartsService.newCart({ products: [] });
    // Esto lo dejo solo para no eliminar filesystem por ser un requisito.. realmente no lo usaria
    await cartManager.createCart(newCart._id.toString());
    res.status(201).json({ success: true, cart: newCart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al crear el carrito" });
  }
};

const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartsService.getCartById(cartId);
    // Esto lo dejo solo para no eliminar filesystem por ser un requisito.. realmente no lo usaria
    await cartManager.getCartById(cartId);
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
};

const addProductToCartById = async (req, res) => {
  try {
    const cartId = req.params.cid.toString();
    const productId = req.params.pid.toString();

    const cart = await cartsService.getCartById(cartId);
    if (!cart) {
      res.status(404).json({ success: false, error: "Carrito no encontrado" });
      return;
    }
    const cart2 = await cartManager.getCartById(cartId);
    const product = await productsService.getProductById(productId);
    if (!product || product.stock === 0) {
      res.status(404).json({
        success: false,
        error: "Producto no encontrado o fuera de stock",
      });
      return;
    }
    const product2 = await productManager.getProductById(productId);

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
};

const deleteProductFromCartById = async (req, res) => {
  try {
    const cartId = req.params.cid.toString();
    const productId = req.params.pid.toString();

    const cart = await cartsService.getCartById(cartId);

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
};

const updateCartById = async (req, res) => {
  try {
    const cartId = req.params.cid.toString();
    const products = req.body.products;

    const cart = await cartsService.getCartById(cartId);

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
};

const updateProductFromCartById = async (req, res) => {
  try {
    const cartId = req.params.cid.toString();
    const productId = req.params.pid.toString();
    const quantity = req.body.quantity;

    const cart = await cartsService.getCartById(cartId);

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
};

const clearCart = async (req, res) => {
  try {
    const cartId = req.params.cid.toString();

    const cart = await cartsService.getCartById(cartId);

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
};

module.exports = {
  newCart,
  getCartById,
  addProductToCartById,
  deleteProductFromCartById,
  updateCartById,
  updateProductFromCartById,
  clearCart,
};
