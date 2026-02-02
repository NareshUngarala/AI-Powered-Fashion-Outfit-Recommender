import mongoose, { Schema, model, models } from 'mongoose';

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  size: { type: String },
  color: { type: String },
});

const ShippingAddressSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  // Add other fields as needed (city, zip, etc.)
});

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, required: true, unique: true }, // User-friendly ID
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  shippingAddress: ShippingAddressSchema,
  paymentMethod: { type: String, default: 'Credit Card (Mock)' },
  createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model('Order', OrderSchema);

export default Order;
