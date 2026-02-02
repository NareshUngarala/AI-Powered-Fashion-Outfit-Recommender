import mongoose, { Schema, model, models } from 'mongoose';

const PaymentMethodSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Credit Card', 'PayPal'],
    default: 'Credit Card',
  },
  cardType: { // Visa, Mastercard, etc.
    type: String,
    default: 'Visa'
  },
  last4: {
    type: String,
    required: true,
  },
  expiryMonth: {
    type: String,
    required: true,
  },
  expiryYear: {
    type: String,
    required: true,
  },
  cardHolderName: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PaymentMethod = models.PaymentMethod || model('PaymentMethod', PaymentMethodSchema);

export default PaymentMethod;
