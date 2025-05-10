let mongoose = require("mongoose")

let Schema = mongoose.Schema

let Registerschema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationcode: String,
    resetOtp: String,
    resetOtpExpires: Date,
}, {
    timestamps: true // optional: adds createdAt and updatedAt fields
});

let RegisterModel = mongoose.model('RegisterModel', Registerschema)

module.exports = RegisterModel;