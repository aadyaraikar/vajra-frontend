const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const transactionsRoutes = require("./routes/transactions");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", service: "upi-fraud-api", version: "1.0.0", time: new Date().toISOString() });
});

app.use("/api/v1", transactionsRoutes);

async function start() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not set in backend/.env");
  }

  await mongoose.connect(MONGO_URI, { dbName: process.env.MONGO_DB_NAME || "upi_fraud_detection" });
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
