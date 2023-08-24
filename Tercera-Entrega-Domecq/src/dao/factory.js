const { PERSISTENCE } = require("../config/env");
const UsersMongoService = require("./mongo/services/users.service");
const ProductsMongoService = require("./mongo/services/products.service");
const CartsMongoService = require("./mongo/services/carts.service");
const MessagesMongoService = require("./mongo/services/messages.service");
const TicketsMongoService = require("./mongo/services/tickets.service");
class UsersDaoFactory {
  constructor() {}
  static getDao() {
    const dao = PERSISTENCE || "MONGO";
    switch (dao) {
      case "MONGO":
        return new UsersMongoService();
      case "*":
        break;
      default:
        return new UsersMongoService();
    }
  }
}

class ProductsDaoFactory {
  constructor() {}
  static getDao() {
    const dao = PERSISTENCE || "MONGO";
    switch (dao) {
      case "MONGO":
        return new ProductsMongoService();
      case "*":
        break;
      default:
        return new ProductsMongoService();
    }
  }
}

class CartsDaoFactory {
  constructor() {}
  static getDao() {
    const dao = PERSISTENCE || "MONGO";
    switch (dao) {
      case "MONGO":
        return new CartsMongoService();
      case "*":
        break;
      default:
        return new CartsMongoService();
    }
  }
}
class MessagesDaoFactory {
  constructor() {}
  static getDao() {
    const dao = PERSISTENCE || "MONGO";
    switch (dao) {
      case "MONGO":
        return new MessagesMongoService();
      case "*":
        break;
      default:
        return new MessagesMongoService();
    }
  }
}

class TicketsDaoFactory {
  constructor() {}
  static getDao() {
    const dao = PERSISTENCE || "MONGO";
    switch (dao) {
      case "MONGO":
        return new TicketsMongoService();
      case "*":
        break;
      default:
        return new TicketsMongoService();
    }
  }
}
module.exports = {
  UsersDaoFactory,
  ProductsDaoFactory,
  CartsDaoFactory,
  MessagesDaoFactory,
  TicketsDaoFactory,
};
