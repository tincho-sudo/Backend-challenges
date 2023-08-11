const Cart = require("../models/cart.model.js");
class CartsDaoMongo {
  constructor() {}

  getAllCarts = async () => {
    try {
      const carts = await Cart.find();
      return carts;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getCartById = async (id) => {
    try {
      const cart = await Cart.findById(id).populate("products.product");
      return cart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  newCart = async (cart) => {
    try {
      const newCart = await Cart.create(cart);
      return newCart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  updateCart = async (id, cart) => {
    try {
      const updatedCart = await Cart.updateOne({ _id: id }, cart);
      return updatedCart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

}

module.exports = CartsDaoMongo;
