const UsersDao = require("../users.mongo");

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

  isPremiumByEmailSync() {
    return this.dao.isPremiumByEmailSync();
  }

  setPremium() {
    return this.dao.setPremium();
  }

  setLastConnection(user) {
    return this.dao.setLastConnection(user);
  }

  updateUserDocuments(user, files) {
    return this.dao.updateUserDocuments(user, files);
  }

  async resetPassword(id, newHashedPassword) {
    try {
      return await this.dao.resetPassword(id, newHashedPassword);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UsersService;
