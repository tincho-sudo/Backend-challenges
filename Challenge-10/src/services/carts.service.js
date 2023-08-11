const CartsDao = require("../dao/mongo/carts.mongo.js");

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
  //     addProductToCartById() {
  //      return this.dao.addProductToCartById();
  //     }
  //        deleteProductFromCartById() {
  //      return this.dao.deleteProductFromCartById();
  //      }
  //    updateProductFromCartById() {
  //   return this.dao.updateProductFromCartById();
  //  }
  //   clearCart() {
  //   return this.dao.clearCart();
  //   }
}

module.exports = CartsService;
