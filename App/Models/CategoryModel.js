const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category_description: {
    type: String,
    required: true,
  },
  views:{
    type:Number,
    default:0
  }
}, {
  timestamps: true // optional: adds createdAt and updatedAt fields
});

// 👇 Registering the model
const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
