import React, { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";

const quickActions = [
  { key: "Send", icon: "send-outline" },
  { key: "Transfer", icon: "bank-transfer-out" },
  { key: "Request", icon: "hand-coin-outline" },
  { key: "Pay Bill", icon: "file-document-outline" },
];

const recipients = [
  { id: "u1", name: "Aarav", vpa: "aarav@oksbi", bank: "State Bank", trustScore: 89 },
  { id: "u2", name: "Isha", vpa: "isha@ybl", bank: "Yes Bank", trustScore: 77 },
  { id: "u3", name: "Rohan", vpa: "rohan@okhdfc", bank: "HDFC Bank", trustScore: 36 },
  { id: "u4", name: "Mira", vpa: "mira@ibl", bank: "IndusInd", trustScore: 64 },
  { id: "u5", name: "Kunal", vpa: "kunal@okaxis", bank: "Axis Bank", trustScore: 28 },
];

const banks = [
  { id: "b1", code: "SBI", icon: "bank-outline" },
  { id: "b2", code: "HDFC", icon: "bank-outline" },
  { id: "b3", code: "ICICI", icon: "bank-outline" },
  { id: "b4", code: "AXIS", icon: "bank-outline" },
  { id: "b5", code: "YES", icon: "bank-outline" },
];

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function trustIcon(score) {
  return score >= 60 ? "shield-check" : "alert-circle";
}

function trustColor(score) {
  return score >= 60 ? appColors.low : appColors.danger;
}

export default function HomeScreen({ navigation }) {
  const [selectedBankId, setSelectedBankId] = useState("b1");
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitCount, setSplitCount] = useState(2);

  const goToPayment = (recipient, actionType = "Send") => {
    navigation.navigate("Payment", { recipient, actionType });
  };

  const splitAmount = (42600 / splitCount).toFixed(2);

  const onConfirmSplit = () => {
    Alert.alert("Split Ready", `Expense split across ${splitCount} people. Each pays Rs ${splitAmount}.`);
    setShowSplitModal(false);
  };

  return (
    <ScreenContainer>
      <LinearGradient colors={["#12a64f", "#0b7c39"]} style={styles.balanceCard}>
        <View style={styles.balanceLeft}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>Rs 2,48,900</Text>
          <View style={styles.balanceStats}>
            <View>
              <Text style={styles.balanceSub}>Income</Text>
              <Text style={styles.balanceSubValue}>Rs 81,500</Text>
            </View>
            <View>
              <Text style={styles.balanceSub}>Expense</Text>
              <Text style={styles.balanceSubValue}>Rs 42,600</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.addMoneyBtn}>
          <Text style={styles.addMoneyText}>+ Add Money</Text>
        </Pressable>
      </LinearGradient>

      <View style={styles.quickWrap}>
        {quickActions.map((item) => (
          <Pressable key={item.key} style={styles.quickItem} onPress={() => goToPayment(recipients[0], item.key)}>
            <View style={styles.quickIconWrap}>
              <MaterialCommunityIcons name={item.icon} size={22} color={appColors.primary} />
            </View>
            <Text style={styles.quickText}>{item.key}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.balanceToolsRow}>
        <Pressable style={styles.checkBalanceBtn}>
          <MaterialCommunityIcons name="bank-check" size={18} color={appColors.text} />
          <Text style={styles.checkBalanceText}>Check Bank Balance</Text>
        </Pressable>
        <Pressable style={styles.splitBtn} onPress={() => setShowSplitModal(true)}>
          <MaterialCommunityIcons name="account-multiple-plus" size={18} color={appColors.primary} />
          <Text style={styles.splitBtnText}>Split Expense</Text>
        </Pressable>
      </View>

      <View style={styles.recipientsHeader}>
        <Text style={styles.sectionTitle}>Choose Bank</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.banksRow}>
        {banks.map((bank) => {
          const active = selectedBankId === bank.id;
          return (
            <Pressable
              key={bank.id}
              style={[styles.bankChip, active && styles.bankChipActive]}
              onPress={() => setSelectedBankId(bank.id)}
            >
              <MaterialCommunityIcons
                name={bank.icon}
                size={16}
                color={active ? "#03280f" : appColors.primary}
              />
              <Text style={[styles.bankChipText, active && styles.bankChipTextActive]}>{bank.code}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.recipientsHeader}>
        <Text style={styles.sectionTitle}>Recipients</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipientsRow}>
        {recipients.map((recipient) => (
          <Pressable key={recipient.id} style={styles.recipientItem} onPress={() => goToPayment(recipient, "Send")}> 
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials(recipient.name)}</Text>
              </View>

              <View style={[styles.trustBadge, { backgroundColor: trustColor(recipient.trustScore) }]}> 
                <MaterialCommunityIcons
                  name={trustIcon(recipient.trustScore)}
                  size={12}
                  color={recipient.trustScore >= 60 ? "#04210e" : "#fff"}
                />
              </View>
            </View>
            <Text style={styles.recipientName}>{recipient.name}</Text>
            <Text style={styles.recipientMeta}>Trust {recipient.trustScore}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Modal visible={showSplitModal} transparent animationType="fade" onRequestClose={() => setShowSplitModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Split Past Expense</Text>
            <Text style={styles.modalMeta}>Expense considered: Rs 42,600</Text>
            <View style={styles.splitControls}>
              <Pressable style={styles.splitControlBtn} onPress={() => setSplitCount((v) => Math.max(2, v - 1))}>
                <Text style={styles.splitControlTxt}>-</Text>
              </Pressable>
              <Text style={styles.splitCount}>{splitCount}</Text>
              <Pressable style={styles.splitControlBtn} onPress={() => setSplitCount((v) => v + 1)}>
                <Text style={styles.splitControlTxt}>+</Text>
              </Pressable>
            </View>
            <Text style={styles.modalMeta}>Each person pays: Rs {splitAmount}</Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.modalGhostBtn} onPress={() => setShowSplitModal(false)}>
                <Text style={styles.modalGhostTxt}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalPrimaryBtn} onPress={onConfirmSplit}>
                <Text style={styles.modalPrimaryTxt}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  balanceLeft: {
    flex: 1,
    gap: 6,
  },
  balanceLabel: {
    color: "rgba(229,255,236,0.92)",
    fontSize: 13,
    fontWeight: "600",
  },
  balanceValue: {
    color: "#f6fff8",
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  balanceStats: {
    flexDirection: "row",
    gap: 22,
    marginTop: 2,
  },
  balanceSub: {
    color: "rgba(229,255,236,0.82)",
    fontSize: 12,
  },
  balanceSubValue: {
    color: "#ffffff",
    fontWeight: "700",
    marginTop: 2,
    fontSize: 13,
  },
  addMoneyBtn: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 14,
    minWidth: 108,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignSelf: "stretch",
  },
  addMoneyText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  quickWrap: {
    marginTop: 8,
    backgroundColor: appColors.panel,
    borderWidth: 1,
    borderColor: appColors.border,
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  quickItem: {
    alignItems: "center",
    width: "24%",
    gap: 8,
  },
  quickIconWrap: {
    height: 52,
    width: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.primarySoft,
    borderWidth: 1,
    borderColor: appColors.border,
  },
  quickText: {
    color: appColors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  balanceToolsRow: {
    marginTop: 8,
    flexDirection: "row",
    gap: 10,
  },
  checkBalanceBtn: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#0d1f17",
    borderWidth: 1,
    borderColor: appColors.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkBalanceText: {
    color: appColors.text,
    fontWeight: "700",
    fontSize: 13,
  },
  splitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.panel,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  splitBtnText: {
    color: appColors.primary,
    fontWeight: "700",
    fontSize: 12,
  },
  recipientsHeader: {
    marginTop: 4,
  },
  sectionTitle: {
    color: appColors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  recipientsRow: {
    paddingBottom: 8,
    gap: 14,
  },
  banksRow: {
    gap: 10,
    paddingBottom: 4,
  },
  bankChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: appColors.border,
    borderRadius: 999,
    backgroundColor: appColors.panel,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bankChipActive: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  bankChipText: {
    color: appColors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  bankChipTextActive: {
    color: "#03280f",
  },
  recipientItem: {
    alignItems: "center",
    width: 74,
    gap: 4,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#163223",
    borderWidth: 1,
    borderColor: appColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: appColors.text,
    fontWeight: "800",
  },
  trustBadge: {
    position: "absolute",
    right: -3,
    bottom: -3,
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: appColors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  recipientName: {
    color: appColors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  recipientMeta: {
    color: appColors.textMuted,
    fontSize: 11,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.panel,
    padding: 16,
    gap: 10,
  },
  modalTitle: {
    color: appColors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  modalMeta: {
    color: appColors.textMuted,
    fontSize: 13,
  },
  splitControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginVertical: 6,
  },
  splitControlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.primarySoft,
  },
  splitControlTxt: {
    color: appColors.primary,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 25,
  },
  splitCount: {
    color: appColors.text,
    fontSize: 18,
    fontWeight: "800",
    minWidth: 24,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  modalGhostBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: appColors.border,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalGhostTxt: {
    color: appColors.textMuted,
    fontWeight: "700",
  },
  modalPrimaryBtn: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: appColors.primary,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalPrimaryTxt: {
    color: "#03280f",
    fontWeight: "800",
  },
});
