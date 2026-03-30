import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";

const recentTransactions = [
  { id: "t1", receiver: "Amazon Pay", amount: 5000, status: "success", time: "Today, 11:02" },
  { id: "t2", receiver: "Unknown Merchant", amount: 2500, status: "flagged", time: "Today, 09:44" },
  { id: "t3", receiver: "Electricity Board", amount: 1870, status: "success", time: "Yesterday, 18:09" },
  { id: "t4", receiver: "Risky VPA", amount: 900, status: "blocked", time: "Yesterday, 12:23" },
];

function statusColor(status) {
  if (status === "success") {
    return appColors.low;
  }
  return appColors.danger;
}

function statusIcon(status) {
  if (status === "success") {
    return "check-circle";
  }
  if (status === "blocked") {
    return "block-helper";
  }
  return "alert-circle";
}

export default function CardsScreen() {
  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>Previous Transactions</Text>
        <Text style={styles.text}>Recent activity from your account.</Text>
      </View>

      <View style={styles.feedWrap}>
        {recentTransactions.map((txn) => (
          <View key={txn.id} style={styles.txnRow}>
            <View style={styles.txnLeft}>
              <View style={[styles.iconDot, { backgroundColor: "rgba(0,255,65,0.12)" }]}>
                <Text style={[styles.iconTxt, { color: statusColor(txn.status) }]}>{"\u25CF"}</Text>
              </View>
              <View>
                <Text style={styles.txnReceiver}>{txn.receiver}</Text>
                <Text style={styles.txnTime}>{txn.time}</Text>
              </View>
            </View>
            <View style={styles.txnRight}>
              <Text style={styles.txnAmount}>Rs {txn.amount}</Text>
              <Text style={[styles.txnStatus, { color: statusColor(txn.status) }]}>{txn.status.toUpperCase()}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.panel,
    padding: 16,
    gap: 8,
  },
  title: {
    color: appColors.text,
    fontSize: 21,
    fontWeight: "800",
  },
  text: {
    color: appColors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  feedWrap: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.panel,
    padding: 10,
    gap: 8,
  },
  txnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: "#0d1f17",
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  txnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  iconDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTxt: {
    fontSize: 12,
    lineHeight: 12,
  },
  txnReceiver: {
    color: appColors.text,
    fontWeight: "700",
    fontSize: 13,
  },
  txnTime: {
    color: appColors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  txnRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  txnAmount: {
    color: appColors.text,
    fontWeight: "800",
    fontSize: 13,
  },
  txnStatus: {
    fontWeight: "700",
    fontSize: 10,
  },
});
