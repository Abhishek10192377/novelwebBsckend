const mongoose = require('mongoose');

const NovelSchema = new mongoose.Schema({
    message: String,
    Book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }
} ,{
    timestamps: true // optional: adds createdAt and updatedAt fields
  });
module.exports = mongoose.model('Novel', NovelSchema);
