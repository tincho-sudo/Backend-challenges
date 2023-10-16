const User = require("./models/user.model.js");
const {
  generateUserErrorInfo,
  generateUserNotFoundInfo,
} = require("../../services/errors/info");
const CustomError = require("../../services/errors/CustomError.js");
const EErrors = require("../../services/errors/enums");
class UsersDaoMongo {
  constructor() {}

  getAllUsers = async () => {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw error;
    }
  };

  getUserByEmail = async (email) => {
    try {
      const user = await User.findOne({ email: email });

      // Estaba teniendo problemas por usar esta misma funcion para revisar si existe un usuario para registrar otro y el login al mismo tiempo
      //     if (!user) {
      //      CustomError.createError({
      //        name: "UserError",
      //        cause: generateUserNotFoundInfo(user),
      //        message: "Login Error",
      //        code: EErrors.LOGIN_ERROR,
      //      });
      //    }
      return user;
    } catch (error) {
      throw error;
    }
  };

  newUser = async (user) => {
    try {
      const newUser = await User.create(user);
      if (!newUser) {
        CustomError.createError({
          name: "UserError",
          cause: generateUserErrorInfo(user),
          message: "Registration Error",
          code: EErrors.REGISTRATION_ERROR,
        });
      }
      return newUser;
    } catch (error) {
      throw error;
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
      throw error;
    }
  };

  getUserById = async (id) => {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw error;
    }
  };
  getUserByQuery = async (query) => {
    try {
      const users = await User.findOne(query);
      return users;
    } catch (error) {
      throw error;
    }
  };

  setPremium = async (user) => {
    try {
      user.role = user.role === "user" ? "premium" : "user";
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  isPremiumByEmailSync = (email) => {
    try {
      //console.log(email);
      const user = User.findOne({ email: email });
      return user.isPremium;
    } catch (error) {
      throw error;
    }
  };

  setLastConnection = async (user) => {
    try {
      user.updateOne({ last_connection: new Date() });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  updateUserDocuments = async (user, files) => {
    try {
      user.updateOne({ documents: files });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = UsersDaoMongo;
