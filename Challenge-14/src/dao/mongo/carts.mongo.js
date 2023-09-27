const Cart = require("./models/cart.model.js");
//const { newTicket } = require("../../controllers/tickets.controller.js");
const { generateCartNotFoundError } = require("../../services/errors/info");
const CustomError = require("../../services/errors/CustomError.js");
const EErrors = require("../../services/errors/enums");
class CartsDaoMongo {
  constructor() {}

  getAllCarts = async (req) => {
    try {
      const carts = await Cart.find();
      return carts;
    } catch (error) {
      req.logger.error(error);
      throw error;
    }
  };

  getCartById = async (req, id) => {
    try {
      const cart = await Cart.findById(id).populate("products.product");
      if (!cart)
        CustomError.createError({
          name: "CartError",
          cause: generateCartNotFoundError(id),
          message: "Cart Error",
          code: EErrors.CART_ERROR,
        });
      return cart;
    } catch (error) {
      req.logger.error(error);
      throw error;
    }
  };

  newCart = async (req,cart) => {
    try {
      const newCart = await Cart.create(cart);
      return newCart;
    } catch (error) {
      req.logger.error(error);
      throw error;
    }
  };

  updateCart = async (req,id, cart) => {
    try {
      const updatedCart = await Cart.updateOne({ _id: id }, cart);
      return updatedCart;
    } catch (error) {
      req.logger.error(error);
      throw error;
    }
  };

  purchase = async (req, purchaser, cart, ticketsService) => {
    try {
      let totalAmount = 0;
      let totalQuantity = 0;
      let productsToKeepInCart = [];
      let productsOutOfStock = [];

      for (const cartProduct of cart.products) {
        const product = cartProduct.product;
        if (!product || product.stock < cartProduct.quantity) {
          // agrego al array de productos sin stock
          productsOutOfStock.push(cartProduct.product);
        } else {
          totalAmount += product.price * cartProduct.quantity;
          totalQuantity += cartProduct.quantity;
          productsToKeepInCart.push(cartProduct);
        }
      }
      if (productsOutOfStock.length > 0) {
        req.logger.error("Some products are out of stock:", productsOutOfStock);
        return productsOutOfStock; // ids de productos sin stock
      }

      // Crear un nuevo ticket
      const ticket = {
        amount: totalQuantity,
        price: totalAmount,
        purchaser: purchaser,
      };
      req.logger.error(ticket);

      const newTicket = await ticketsService.newTicket(ticket);

      req.logger.debug("New ticket created:", newTicket);

      // Actualizar el carrito solo con los productos que no se completaron
      await Cart.findByIdAndUpdate(cart._id, {
        products: productsToKeepInCart,
      });

      req.logger.info("Cart updated with remaining products.");
    } catch (error) {
      req.logger.error("Error creating ticket:", error);
    }
  };
}

module.exports = CartsDaoMongo;
