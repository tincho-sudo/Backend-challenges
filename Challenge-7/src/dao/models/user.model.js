const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  //priv: { type: String, required: true }, ......
  password: {
    type: String,
    required: true,
  },
  first_name: { type: String },
  last_name: { type: String },
  age: { type: Number },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
