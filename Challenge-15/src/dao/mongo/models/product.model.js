const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  owner: {
    type: String,
    default: "admin",
    validate: {
      validator: async function (email) {
        try {
          const isPremiumUser = await this.validateOwner(email);
          return isPremiumUser;
        } catch (error) {
          throw new Error("Error validating owner premium status. ", error);
        }
      },
      message: "Owner must be a premium user.",
    },
  },
});

productSchema.methods.validateOwner = async function (email) {
  const { UsersDaoFactory } = require("../../factory");
  const usersService = UsersDaoFactory.getDao();
  const isPremiumUser = await usersService.isPremiumByEmail(email);
  return isPremiumUser;
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
