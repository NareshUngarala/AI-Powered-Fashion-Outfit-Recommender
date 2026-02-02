import mongoose, { Schema, model, models } from 'mongoose';

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  size: { type: String },
  color: { type: String },
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

CartSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Cart = models.Cart || model('Cart', CartSchema);

export default Cart;
