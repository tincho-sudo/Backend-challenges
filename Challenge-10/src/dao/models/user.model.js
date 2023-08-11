const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
  },
  first_name: { type: String },
  last_name: { type: String },
  age: { type: Number },
  role: { type: String, default: "user" },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
