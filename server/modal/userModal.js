const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  village: { type: String, required: true },
  enterCode: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // New password field
  upiId: {
    type: String,
    required: true,
    unique: true,
  },
  milkman: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Milkman schema
    ref: "Milkman", // Links to the Milkman model
    required: true, // Make it required if every user must have an associated milkman
  },
  userType: { type: String, required: true },
  location: {
    type: {
      latitude: { type: Number, required: true }, // Latitude value
      longitude: { type: Number, required: true }, // Longitude value
      accuracy: { type: Number, required: true }, // Accuracy in meters
      altitude: { type: Number, default: 0 }, // Optional altitude
      altitudeAccuracy: { type: Number, default: 0 }, // Optional altitude accuracy
      heading: { type: Number, default: 0 }, // Heading (defaulted to 0 if unavailable)
      speed: { type: Number, default: 0 }, // Speed (defaulted to 0 if unavailable)
    },
  },
  profileImage: {
    data: { type: Buffer, default: "" },
    contentType: { type: String, default: "" },
  },
  milkQuantity:{
    type:String,
    default:5
  },
  milkRate:{
    type:Number,
    default:0
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
