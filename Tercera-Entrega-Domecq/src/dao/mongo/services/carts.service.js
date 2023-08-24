const CartsDao = require("../carts.mongo");

class CartsService {
  constructor() {
    this.dao = new CartsDao();
  }

  getAllCarts() {
    return this.dao.getAllCarts();
  }

  getCartById(id) {
    return this.dao.getCartById(id);
  }
  newCart(cart) {
    return this.dao.newCart(cart);
  }
  updateCartById(id) {
    return this.dao.updateCart(id);
  }

  purchase(purchaser,cart) {
    return this.dao.purchase(purchaser,cart);
  }

}

module.exports = CartsService;
