const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  code: {
    type: String,
    min: 6,
    max: 15,
    default: (generateRandom = () => {
      const randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
      this.randomCode = Math.random()
        .toString(36)
        .substring(2, randomInt(6, 10));
      return randomCode;
    }),
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
