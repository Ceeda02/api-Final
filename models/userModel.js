const mongoose = require("mongoose");
const validator = require("validator");

const DonationSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
  },
  ewasteType: {
    type: String,
  },
  donationAmount: {
    type: String,
  },
  fullName: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Declined"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      isAsync: false,
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user", // Set the default role to "user"
  },
  donations: {
    type: [DonationSchema], // This is the nested array for donations
    default: [], // Initialize donations as an empty array
  },
});

module.exports = mongoose.model("User", UserSchema);
