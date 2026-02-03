import { Schema, model, models } from 'mongoose';

const OutfitItemSchema = new Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String },
  reason: { type: String },
  // Optional link to a real product if available
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  // Fields for when it's just a generic recommendation (no real product)
  // or when we want to cache the display details of the real product at the time of creation
  price: { type: Number },
  image: { type: String }
});

const OutfitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    default: 'My AI Outfit'
  },
  // The product this outfit was generated for
  mainProductId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  items: [OutfitItemSchema],
  styleAdvice: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Outfit = models.Outfit || model('Outfit', OutfitSchema);

export default Outfit;
