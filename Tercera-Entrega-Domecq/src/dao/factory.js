const { PERSISTENCE } = require("../config/env");
const TicketsMongoService = require("./mongo/services/tickets.service");
const UsersMongoService = require("./mongo/services/users.service");
const ProductsMongoService = require("./mongo/services/products.service");
const CartsMongoService = require("./mongo/services/carts.service");
const MessagesMongoService = require("./mongo/services/messages.service");
const dao = process.argv[3] || PERSISTENCE || "MONGO";
class UsersDaoFactory {
  constructor() {}
  static getDao() {
    switch (dao) {
      case "MONGO":
        return new UsersMongoService();
      case "OTHER":
        break;
      default:
        return new UsersMongoService();
    }
  }
}

class ProductsDaoFactory {
  constructor() {}
  static getDao() {
    switch (dao) {
      case "MONGO":
        return new ProductsMongoService();
      case "OTHER":
        break;
      default:
        return new ProductsMongoService();
    }
  }
}

class CartsDaoFactory {
  constructor() {}
  static getDao() {
    switch (dao) {
      case "MONGO":
        return new CartsMongoService();
      case "OTHER":
        break;
      default:
        return new CartsMongoService();
    }
  }
}
class MessagesDaoFactory {
  constructor() {}
  static getDao() {
    switch (dao) {
      case "MONGO":
        return new MessagesMongoService();
      case "OTHER":
        break;
      default:
        return new MessagesMongoService();
    }
  }
}

class TicketsDaoFactory {
  constructor() {}
  static getDao() {
    switch (dao) {
      case "MONGO":
        return new TicketsMongoService();
      case "OTHER":
        break;
      default:
        return new TicketsMongoService();
    }
  }
}
module.exports = {
  TicketsDaoFactory,
  UsersDaoFactory,
  ProductsDaoFactory,
  CartsDaoFactory,
  MessagesDaoFactory,
};
