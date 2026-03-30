const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();

router.get("/transactions", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Transaction.find({})
        .sort({ time: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments({}),
    ]);

    res.json({
      items: items.map((t) => ({
        id: t.txnId,
        receiverName: t.receiverName,
        upiRecipient: t.upiRecipient,
        amount: t.amount,
        currency: t.currency,
        score: t.score,
        status: t.status,
        time: t.time,
      })),
      pagination: { page, limit, total },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
});

router.post("/transactions", async (req, res) => {
  try {
    const body = req.body || {};
    const txnId = body.id || body.txnId;

    if (!txnId || !body.receiverName || !body.upiRecipient || typeof body.amount !== "number") {
      return res.status(400).json({ message: "Missing required transaction fields" });
    }

    const payload = {
      txnId,
      receiverName: body.receiverName,
      upiRecipient: body.upiRecipient,
      amount: body.amount,
      currency: body.currency || "INR",
      score: Number(body.score || 0),
      status: body.status || "success",
      time: body.time ? new Date(body.time) : new Date(),
    };

    const saved = await Transaction.findOneAndUpdate(
      { txnId },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return res.status(201).json({
      id: saved.txnId,
      receiverName: saved.receiverName,
      upiRecipient: saved.upiRecipient,
      amount: saved.amount,
      currency: saved.currency,
      score: saved.score,
      status: saved.status,
      time: saved.time,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to save transaction", error: error.message });
  }
});

module.exports = router;
