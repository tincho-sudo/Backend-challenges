const { ProductsDaoFactory, CartsDaoFactory, TicketsDaoFactory } = require("../dao/factory.js");

const cartsService = CartsDaoFactory.getDao();
const ticketsService = TicketsDaoFactory.getDao();
const productsService = ProductsDaoFactory.getDao();

const newCart = async (_, res) => {
  try {
    const newCart = await cartsService.newCart({ products: [] });
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
    return async (req, res) => {
      if (req.user.role === "user") {
        res.status(200).json({ success: true, message: "Product created" });
        await this.dao.newMessage(message);

        const cartId = req.params.cid.toString();
        const productId = req.params.pid.toString();

        const cart = await cartsService.getCartById(cartId);
        if (!cart) {
          res
            .status(404)
            .json({ success: false, error: "Carrito no encontrado" });
          return;
        }
        const product = await productsService.getProductById(productId);
        if (!product || product.stock === 0) {
          res.status(404).json({
            success: false,
            error: "Producto no encontrado o fuera de stock",
          });
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

        res.status(200).json({ success: true, cart: cart });
      } else {
        res.status(403).json({ success: false, error: "Unauthorized" });
      }
    };
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
      const ticket = await cartsService.purchase(req.session.user.email, cart, ticketsService);

      res.status(200).json({ success: true, cart: cart, ticket: ticket });
    } else
      res.status(500).json({
        success: false,
        error: "Auth error",
      });
  } catch (error) {
    console.error(error);
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
  purchase,
};
