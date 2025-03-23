// models/Feedback.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["seller", "buyer", "milkman"],
      required: true,
    },
    unread:{
      type:Boolean,
      default:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
