import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchRecentTransactions, saveTransaction } from "../services/fraudApi";

const seedTransactions = [
  {
    _id: "seed-1",
    receiverName: "Amazon Pay",
    amount: 5000,
    status: "success",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    merchantTrustScore: 98,
    upiId: "amazon@upi",
  },
  {
    _id: "seed-2",
    receiverName: "Unknown Merchant",
    amount: 2500,
    status: "flagged",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    merchantTrustScore: 24,
    upiId: "scammer@upi",
  },
  {
    _id: "seed-3",
    receiverName: "Electricity Board",
    amount: 1870,
    status: "success",
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    merchantTrustScore: 93,
    upiId: "biller@upi",
  },
];

const TransactionsContext = createContext(null);

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState(seedTransactions);

  useEffect(() => {
    const load = async () => {
      const remoteItems = await fetchRecentTransactions(25);
      if (!remoteItems.length) {
        return;
      }

      const normalizedRemote = remoteItems.map((item) => ({
        _id: item.id || item._id || `txn-${Date.now()}-${Math.random()}`,
        receiverName: item.receiverName || item.upiRecipient || "Unknown",
        amount: Number(item.amount || 0),
        status: item.status || "success",
        timestamp: item.time || item.timestamp || new Date().toISOString(),
        merchantTrustScore: Number(item.score || item.merchantTrustScore || 0),
        upiId: item.upiRecipient || item.upiId || "unknown@upi",
      }));

      setTransactions(normalizedRemote);
    };

    load();
  }, []);

  const addTransaction = async (txn) => {
    const normalized = {
      _id: txn._id || `txn-${Date.now()}`,
      receiverName: txn.receiverName || "Unknown",
      amount: Number(txn.amount || 0),
      status: txn.status || "success",
      timestamp: txn.timestamp || new Date().toISOString(),
      merchantTrustScore: Number(txn.merchantTrustScore || 0),
      upiId: txn.upiId || "unknown@upi",
    };

    setTransactions((prev) => [normalized, ...prev]);

    await saveTransaction({
      id: normalized._id,
      receiverName: normalized.receiverName,
      upiRecipient: normalized.upiId,
      amount: normalized.amount,
      score: normalized.merchantTrustScore,
      status: normalized.status,
      time: normalized.timestamp,
      currency: "INR",
    });

    return normalized;
  };

  const value = useMemo(
    () => ({
      transactions,
      addTransaction,
    }),
    [transactions]
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) {
    throw new Error("useTransactions must be used within TransactionsProvider");
  }
  return ctx;
}
