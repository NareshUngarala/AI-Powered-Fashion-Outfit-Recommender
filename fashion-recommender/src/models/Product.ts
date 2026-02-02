import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'shirt', 'pants', 'shoes', 'accessory', 'outerwear', 
      'Dresses', 'Tops', 'Bottoms', 'Bags', 'Accessories', 'Outerwear',
      'New Arrivals', 'Essentials', 'Best Sellers', 'Seasonal', 
      'Activewear', 'Formalwear', 'Footwear', 'Style Guides'
    ],
  },
  brand: {
    type: String,
  },
  match: {
    type: Number,
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  tags: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = models.Product || model('Product', ProductSchema);

export default Product;
