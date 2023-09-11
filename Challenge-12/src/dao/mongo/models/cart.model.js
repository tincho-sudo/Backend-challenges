const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
