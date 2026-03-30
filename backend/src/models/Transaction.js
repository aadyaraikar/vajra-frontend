const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    txnId: { type: String, required: true, unique: true, index: true },
    receiverName: { type: String, required: true },
    upiRecipient: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    score: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["success", "flagged", "blocked"],
      default: "success",
    },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
