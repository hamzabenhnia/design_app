const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: [String],
  baseImageUrl: [String], // url PNG/SVG du maillot de base
  colors: [String],
  templates: [{ name: String, imageUrl: String }],
  price: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
