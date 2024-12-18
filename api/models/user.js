// Code for the User Schema
const mongoose = require("mongoose");

// User Schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  addresses: [
    {
      name: String,
      mobileNo: String,
      houseNo: String,
      street: String,
      landmark: String,
      city: String,
      country: String,
      postalCode: String,
    },
  ],
  // Order ID's for a particular user.
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Initialize userSchema for export
const User = mongoose.model("User", userSchema);
// Export User
module.exports = User;