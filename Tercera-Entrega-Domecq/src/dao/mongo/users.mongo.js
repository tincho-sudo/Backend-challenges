const User = require("./models/user.model.js");
class UsersDaoMongo {
  constructor() {}

  getAllUsers = async () => {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getUserByEmail = async (email) => {
    try {
      const user = await User.findOne({ email: email });
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  newUser = async (user) => {
    try {
      const newUser = await User.create(user);
      return newUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  resetPassword = async (id, newHashedPassword) => {
    try {
      const updatedUser = await User.updateOne(
        { _id: id },
        { $set: { password: newHashedPassword } }
      );
      return updatedUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getUserById = async (id) => {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  getUserByQuery = async (query) => {
    try {
      const users = await User.findOne(query);
      return users;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

module.exports = UsersDaoMongo;
