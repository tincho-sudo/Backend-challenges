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
  categ: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    default: "admin",
    validate: {
      validator: function (email) {
        return this.validateOwnerSync(email);
      },
      message: "Owner must be a premium user.",
    },
  },
});

productSchema.methods.validateOwnerSync = function (email) {
  const { UsersDaoFactory } = require("../../factory");
  const usersService = UsersDaoFactory.getDao();
  const isPremiumUser = usersService.isPremiumByEmailSync(email);
  return isPremiumUser;
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
