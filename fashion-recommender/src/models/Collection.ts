import { Schema, model, models } from 'mongoose';

const CollectionSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a collection name'],
    unique: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    unique: true,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Collection = models.Collection || model('Collection', CollectionSchema);

export default Collection;
