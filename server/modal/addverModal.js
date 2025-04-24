const mongoose = require("mongoose");

const advertSchema = new mongoose.Schema({
  media: {
    data: Buffer,
    contentType: String,
  },
  mediaType: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  description: {
    type: String,
  },
  expiryDate: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model("Advert", advertSchema);
