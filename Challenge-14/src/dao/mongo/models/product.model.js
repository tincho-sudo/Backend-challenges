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
      validator: async function (value) {
        const isPremiumUser = await isPremiumByEmail(value);
        return isPremiumUser;
      },
      message: "Owner must be a premium user.",
    },
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;