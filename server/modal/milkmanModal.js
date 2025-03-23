const mongoose = require("mongoose");
const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "make it",
  },
  request: {
    type: String,
    default: "make it",
  },
  time: {
    type: String,
    default: "make it",
  },
  requestType: {
    type: String,
    default: "make it",
  },
});
const milkmanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  upiId: { type: String, required: true },
  village: { type: String, required: true },
  enterCode: { type: String, required: true, unique: true },
  subcriptionCode: { type: String, required: true },
  password: { type: String, required: true }, // New password field
  buyMilk: {
    type: String,
    default: "",
  },
  sellMilk: {
    type: String,
    default: "",
  },
  customer: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Milkman schema
      ref: "User", // Add the referenced model name
    },
  ],
  seller: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Milkman schema
      ref: "User", // Add the referenced model name
    },
  ],
  requests: [requestSchema], // An array of requests, using the Request schema

  products: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Milkman schema
      ref: "Product", // Add the referenced model name
    },
  ],
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
    required: true, // Ensure location data is always provided
  },
  profileImage: {
    data: { type: Buffer, default: "" },
    contentType: { type: String, default: "" },
  },
  categoryProduct: [
    {
      name: { type: String, default: "" }
    }
  ]
});

const Milkman = mongoose.model("Milkman", milkmanSchema);

module.exports = Milkman;
