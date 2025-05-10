const mongoose = require('mongoose');

const userregisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email format'],
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Phone must be 10 digits'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 8,
    select: false 
  },
  isVerified:{
   type:Boolean,
   default:false
  },
  verificationcode:String,
  resetOtp:String,
  resetOtpExpires: Date, 
  favouriteBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], // Array of book IDs (referencing Book model)
  comments: [
    {
      UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'userRegister' },
      message: String,
      image: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('userRegister', userregisterSchema);
