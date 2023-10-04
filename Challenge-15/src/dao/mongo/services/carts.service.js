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
    return async (req, res) => {
      if (req.user.role === "admin") {
        res.status(200).json({ success: true, message: "Cart updated" });
        await this.dao.updateCart(id,req,res);
      } else {
        res.status(403).json({ success: false, error: "Unauthorized" });
      }
    };
  }

  purchase(purchaser, cart, ticketsService) {
    return this.dao.purchase(purchaser, cart, ticketsService);
  }
}

module.exports = CartsService;
