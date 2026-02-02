import { Schema, model, models } from 'mongoose';

const WishlistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Wishlist = models.Wishlist || model('Wishlist', WishlistSchema);

export default Wishlist;
