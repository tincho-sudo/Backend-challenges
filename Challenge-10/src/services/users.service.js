const UsersDao = require("../dao/mongo/users.mongo.js");

class UsersService {
  constructor() {
    this.dao = new UsersDao();
  }

  getAllUsers() {
    return this.dao.getAllUsers();
  }

  getUserByEmail(email) {
    return this.dao.getUserByEmail(email);
  }
  newUser(user) {
    return this.dao.newUser(user);
  }

  getUserById(id) {
    return this.dao.getUserById(id);
  }
  getUserByQuery(query) {
    return this.dao.getUserByQuery(query);
  }
}

module.exports = UsersService;
