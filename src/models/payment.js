const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  payment_method: {
    type: String,
    enum: ["momo", "visa", "mastercard"],
    required: true,
  },
  transaction_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
