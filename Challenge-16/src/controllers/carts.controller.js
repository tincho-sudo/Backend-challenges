const {
  ProductsDaoFactory,
  CartsDaoFactory,
  TicketsDaoFactory,
} = require("../dao/factory.js");

const cartsService = CartsDaoFactory.getDao();
const ticketsService = TicketsDaoFactory.getDao();
const productsService = ProductsDaoFactory.getDao();

const newCart = async (_, res) => {
  try {
    const newCart = await cartsService.newCart({ products: [] });
    res.status(201).json({ success: true, cart: newCart });
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al crear el carrito" });
  }
};

const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartsService.getCartById(req, cartId);
    if (cart) {
      res.status(200).json({ success: true, products: cart.products });
    } else {
      res.status(404).json({ success: false, error: "Carrito no encontrado" });
    }
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({
      success: false,
      error: "Error al obtener los productos del carrito",
    });
  }
};

const addProductToCartById = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;

    if (user.role === "user") {

      const cartId = req.params.cid.toString();
      const productId = req.params.pid.toString();

      const cart = await cartsService.getCartById(req, cartId);

      if (!cart) {
        return res
          .status(404)
          .json({ success: false, error: "Carrito no encontrado" });
      }
      const product = await productsService.getProductById(productId);
      if (!product || product.stock === 0) {
        return res.status(404).json({
          success: false,
          error: "Producto no encontrado o fuera de stock",
        });
      }

      if (user.isPremium && product.owner === userId) {
        return res.status(403).json({
          success: false,
          error:
            "No es posible permitido agregar tu propio producto al carrito",
        });
      }

      const existingProductIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity++;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();

      return res.status(200).json({ success: true, cart: cart });
    } else {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({
      success: false,
      error: "Error al agregar el producto al carrito ",
      error,
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
    req.logger.error(error);
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
    req.logger.error(error);
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
    req.logger.error(error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar la cantidad del producto en el carrito",
    });
  }
};
const purchase = async (req, res) => {
  try {
    const cartId = req.params.cid.toString();
    const cart = await cartsService.getCartById(cartId);
    if (req.session.user) {
      if (!cart) {
        res
          .status(404)
          .json({ success: false, error: "Carrito no encontrado" });
        return;
      }
      const ticket = await cartsService.purchase(
        req.session.user.email,
        cart,
        ticketsService
      );

      res.status(200).json({ success: true, cart: cart, ticket: ticket });
    } else
      res.status(500).json({
        success: false,
        error: "Auth error",
      });
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({
      success: false,
      error: "Error al comprar todos los productos del carrito",
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
    req.logger.error(error);
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
  purchase,
};
