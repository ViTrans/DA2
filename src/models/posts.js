const mongoose = require("mongoose");
const { Schema } = mongoose;
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
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
    isvip: {
      type: Number,
    },
    acreage: {
      type: Number,
    },
    category_id: [{ type: Schema.Types.ObjectId, ref: "Categories" }],
    user_id: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Posts", postSchema);
