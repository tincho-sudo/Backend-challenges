const CartsDao = require("../carts.mongo");

class CartsService {
  constructor() {
    this.dao = new CartsDao();
  }

  getAllCarts(req) {
    return this.dao.getAllCarts();
  }

  getCartById = async (req, id) => {
    return this.dao.getCartById(req, id);
  };
  newCart(req, cart) {
    return this.dao.newCart(req, cart);
  }
  updateCartById(id) {
    return async (req, res) => {
      if (req.user.role === "admin") {
        res.status(200).json({ success: true, message: "Cart updated" });
        await this.dao.updateCart(id, req, res);
      } else {
        res.status(403).json({ success: false, error: "Unauthorized" });
      }
    };
  }

  purchase(req, purchaser, cart,ticketsService) {
    return this.dao.purchase(req, purchaser, cart,ticketsService);
  }
}

module.exports = CartsService;
