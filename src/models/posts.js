const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  images: {
    type: Array,
  },
  phone: {
    type: String,
  },
  rate: {
    type: Number,
  },
});

module.exports = mongoose.model("Post", postSchema);
