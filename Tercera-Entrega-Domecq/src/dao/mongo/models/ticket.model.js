const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const generateRandomCode = () => {
  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomCode = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = randomInt(0, characters.length - 1);
    randomCode += characters[randomIndex];
  }
  return randomCode;
};

const ticketSchema = new Schema({
  code: {
    type: String,
    min: 6,
    max: 15,
    default: generateRandomCode,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
