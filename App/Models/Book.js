const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  details: String,
  image: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to Category model
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
 
}, {
  timestamps: true // optional: adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Book', bookSchema);
