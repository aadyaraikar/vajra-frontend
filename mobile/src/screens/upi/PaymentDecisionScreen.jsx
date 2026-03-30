import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Animated,
  Alert,
  ToastAndroid,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";

// Mock banks data
const BANKS = [
  { id: "1", name: "State Bank of India", code: "SBI", icon: "bank", color: "#1f2937" },
  { id: "2", name: "HDFC Bank", code: "HDFC", icon: "bank", color: "#e63946" },
  { id: "3", name: "ICICI Bank", code: "ICICI", icon: "bank", color: "#0066cc" },
  { id: "4", name: "Axis Bank", code: "AXIS", icon: "bank", color: "#003366" },
  { id: "5", name: "Yes Bank", code: "YES", icon: "bank", color: "#ffc72c" },
  { id: "6", name: "Kotak Bank", code: "KOTAK", icon: "bank", color: "#e71c24" },
];

// Mock transaction state
const MOCK_TRANSACTION = {
  amount: 2500,
  receiverName: "Unknown Merchant",
  upiId: "scammer@upi",
  trustScore: 24,
  isFraudulent: true,
  fraudReason: "High volume of recent reports for this VPA.",
  txnId: "TXN-20260330-001234",
  timestamp: new Date(),
};

function AnimatedCheckmark() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.checkmarkContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <MaterialCommunityIcons name="check-circle" size={80} color={appColors.low} />
    </Animated.View>
  );
}

function PulsingAlertIcon() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.alertIconContainer,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <MaterialCommunityIcons name="alert-octagon" size={80} color="#e15252" />
    </Animated.View>
  );
}

export default function PaymentDecisionScreen({ navigation, route }) {
  const [transaction, setTransaction] = useState(MOCK_TRANSACTION);
  const [selectedBank, setSelectedBank] = useState(BANKS[0]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [pastTransactions, setPastTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [splitCount, setSplitCount] = useState(1);
  const [testFraudMode, setTestFraudMode] = useState(true);
  const [expandedTxnId, setExpandedTxnId] = useState(null);

  useEffect(() => {
    fetchPastTransactions();
  }, []);

  useEffect(() => {
    const incoming = route?.params?.transaction;
    if (incoming) {
      setTransaction({
        ...incoming,
        timestamp: incoming.timestamp ? new Date(incoming.timestamp) : new Date(),
      });
      setTestFraudMode(Boolean(incoming.isFraudulent));
    }
  }, [route?.params?.transaction]);

  const fetchPastTransactions = async () => {
    setLoading(true);
    try {
      // Simulated data fetch - replace with real API call to your backend
      const mockData = [
        {
          _id: "txn-001",
          receiverName: "Amazon Pay",
          amount: 5000,
          status: "success",
          timestamp: new Date(Date.now() - 86400000),
          merchantTrustScore: 98,
        },
        {
          _id: "txn-002",
          receiverName: "Suspicious Merchant",
          amount: 1500,
          status: "flagged",
          timestamp: new Date(Date.now() - 172800000),
          merchantTrustScore: 35,
        },
        {
          _id: "txn-003",
          receiverName: "Flipkart",
          amount: 3200,
          status: "success",
          timestamp: new Date(Date.now() - 259200000),
          merchantTrustScore: 96,
        },
        {
          _id: "txn-004",
          receiverName: "Scam Detected",
          amount: 2000,
          status: "blocked",
          timestamp: new Date(Date.now() - 345600000),
          merchantTrustScore: 12,
        },
      ];

      // Uncomment below to use real API:
      // const response = await fetch(`${API_BASE_URL}/api/v1/transactions?limit=10`);
      // const data = await response.json();
      // setPastTransactions(data.items);

      setPastTransactions(mockData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockPayment = () => {
    ToastAndroid.show("Payment Blocked Successfully ✓", ToastAndroid.LONG);
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  const handleSplitExpense = () => {
    const splitAmount = (transaction.amount / splitCount).toFixed(2);
    Alert.alert(
      "Split Confirmed",
      `Splitting ₹${transaction.amount} among ${splitCount} people\nEach pays: ₹${splitAmount}`
    );
  };

  const toggleFraudMode = () => {
    setTestFraudMode(!testFraudMode);
    setTransaction((prev) => ({
      ...prev,
      isFraudulent: !prev.isFraudulent,
      trustScore: !prev.isFraudulent ? 24 : 98,
      fraudReason: !prev.isFraudulent
        ? "High volume of recent reports for this VPA."
        : "",
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return appColors.low;
      case "flagged":
        return appColors.warning;
      case "blocked":
        return appColors.danger;
      default:
        return appColors.textMuted;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return "check-circle";
      case "flagged":
        return "alert-circle";
      case "blocked":
        return "block-helper";
      default:
        return "help-circle";
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={appColors.text} />
        </Pressable>
        <Text style={styles.header}>Payment Decision</Text>
        <Pressable onPress={toggleFraudMode} style={styles.testBtn}>
          <Text style={styles.testBtnText}>{testFraudMode ? "Test: Fraud" : "Test: Safe"}</Text>
        </Pressable>
      </View>

      {/* Main Payment Card */}
      <View
        style={[
          styles.paymentCard,
          {
            borderColor: transaction.isFraudulent ? appColors.danger : appColors.low,
            backgroundColor: transaction.isFraudulent ? "#2a0d10" : "#0d2e1a",
          },
        ]}
      >
        {transaction.isFraudulent ? <PulsingAlertIcon /> : <AnimatedCheckmark />}

        <Text
          style={[
            styles.statusTitle,
            { color: transaction.isFraudulent ? "#e15252" : appColors.low },
          ]}
        >
          {transaction.isFraudulent ? "Suspicious Activity Detected" : "Payment Successful"}
        </Text>

        {/* Trust Badge */}
        <View
          style={[
            styles.trustBadge,
            {
              backgroundColor: transaction.isFraudulent
                ? "rgba(225, 82, 82, 0.2)"
                : "rgba(54, 209, 111, 0.2)",
              borderColor: transaction.isFraudulent ? appColors.danger : appColors.low,
            },
          ]}
        >
          <Text
            style={[
              styles.trustText,
              { color: transaction.isFraudulent ? "#e15252" : appColors.low },
            ]}
          >
            Merchant Trust: {transaction.trustScore}/100{" "}
            {transaction.isFraudulent ? "- High Risk" : "- Verified"}
          </Text>
        </View>

        {/* Fraud Reason (if fraudulent) */}
        {transaction.isFraudulent && (
          <View style={styles.fraudReasonBox}>
            <MaterialCommunityIcons name="information" size={16} color="#fff" />
            <Text style={styles.fraudReasonText}>{transaction.fraudReason}</Text>
          </View>
        )}

        {/* Transaction Details */}
        <View style={styles.detailsBox}>
          <DetailRow label="Amount" value={`₹ ${transaction.amount}`} />
          <DetailRow label="Receiver" value={transaction.receiverName} />
          <DetailRow label="UPI ID" value={transaction.upiId} />
          <DetailRow
            label="Date/Time"
            value={transaction.timestamp.toLocaleString()}
          />
        </View>

        {/* Expandable Txn ID */}
        <Pressable
          onPress={() =>
            setExpandedTxnId(expandedTxnId === transaction.txnId ? null : transaction.txnId)
          }
          style={styles.expandBtn}
        >
          <Text style={styles.expandBtnText}>
            {expandedTxnId === transaction.txnId ? "Hide" : "View"} Transaction ID
          </Text>
          <MaterialCommunityIcons
            name={expandedTxnId === transaction.txnId ? "chevron-up" : "chevron-down"}
            size={18}
            color={appColors.primary}
          />
        </Pressable>

        {expandedTxnId === transaction.txnId && (
          <View style={styles.txnIdBox}>
            <Text style={styles.txnIdText}>{transaction.txnId}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          {transaction.isFraudulent ? (
            <>
              <Pressable
                style={styles.blockBtn}
                onPress={handleBlockPayment}
              >
                <LinearGradient
                  colors={["#c73939", "#a01a1a"]}
                  style={styles.blockBtnGradient}
                >
                  <MaterialCommunityIcons name="block-helper" size={18} color="#fff" />
                  <Text style={styles.blockBtnText}>Block & Report</Text>
                </LinearGradient>
              </Pressable>
              <Pressable style={styles.proceedBtn}>
                <Text style={styles.proceedBtnText}>Proceed Anyway</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={styles.doneBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.doneBtnText}>Done</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Bank Selection */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Select Bank</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.banksRow}
      >
        {BANKS.map((bank) => (
          <Pressable
            key={bank.id}
            style={[
              styles.bankOption,
              selectedBank.id === bank.id && styles.bankOptionSelected,
            ]}
            onPress={() => setSelectedBank(bank)}
          >
            <View
              style={[
                styles.bankIconCircle,
                { backgroundColor: selectedBank.id === bank.id ? appColors.primary : "#1a3a2a" },
              ]}
            >
              <MaterialCommunityIcons
                name={bank.icon}
                size={20}
                color={selectedBank.id === bank.id ? "#03280f" : appColors.primary}
              />
            </View>
            <Text style={styles.bankCode}>{bank.code}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActionsRow}>
        <Pressable style={styles.quickAction} onPress={() => setShowQRModal(true)}>
          <MaterialCommunityIcons name="qrcode" size={24} color={appColors.primary} />
          <Text style={styles.quickActionText}>QR Code</Text>
        </Pressable>
        <Pressable style={styles.quickAction} onPress={() => setShowSplitModal(true)}>
          <MaterialCommunityIcons name="plus-circle-multiple" size={24} color={appColors.primary} />
          <Text style={styles.quickActionText}>Split</Text>
        </Pressable>
      </View>

      {/* Past Transactions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={appColors.primary} size="large" />
      ) : (
        <View style={styles.transactionsList}>
          {pastTransactions.map((txn) => (
            <View key={txn._id} style={styles.transactionItem}>
              <View style={styles.txnLeft}>
                <MaterialCommunityIcons
                  name={getStatusIcon(txn.status)}
                  size={24}
                  color={getStatusColor(txn.status)}
                />
                <View style={styles.txnInfo}>
                  <Text style={styles.txnName}>{txn.receiverName}</Text>
                  <Text style={styles.txnTime}>
                    {new Date(txn.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.txnRight}>
                <Text style={styles.txnAmount}>₹ {txn.amount}</Text>
                <Text style={[styles.txnStatus, { color: getStatusColor(txn.status) }]}>
                  {txn.status.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* QR Code Modal */}
      <Modal visible={showQRModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Pressable onPress={() => setShowQRModal(false)} style={styles.modalClose}>
              <MaterialCommunityIcons name="close" size={24} color={appColors.text} />
            </Pressable>
            <Text style={styles.modalTitle}>Your Receiving QR</Text>
            <View style={styles.qrCodeBox}>
              <Text style={styles.qrPlaceholder}>upi://pay?pa=yourname@upi</Text>
              <MaterialCommunityIcons
                name="qrcode"
                size={120}
                color={appColors.primary}
              />
            </View>
            <Text style={styles.modalDesc}>Share this with anyone to receive payments</Text>
            <Pressable style={styles.modalBtn} onPress={() => setShowQRModal(false)}>
              <Text style={styles.modalBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Split Expense Modal */}
      <Modal visible={showSplitModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Pressable onPress={() => setShowSplitModal(false)} style={styles.modalClose}>
              <MaterialCommunityIcons name="close" size={24} color={appColors.text} />
            </Pressable>
            <Text style={styles.modalTitle}>Split Expense</Text>
            <View style={styles.splitContainer}>
              <Text style={styles.splitLabel}>Original Amount: ₹ {transaction.amount}</Text>
              <View style={styles.splitControls}>
                <Pressable
                  style={styles.splitBtn}
                  onPress={() => setSplitCount(Math.max(1, splitCount - 1))}
                >
                  <Text style={styles.splitBtnText}>−</Text>
                </Pressable>
                <Text style={styles.splitCount}>{splitCount}</Text>
                <Pressable
                  style={styles.splitBtn}
                  onPress={() => setSplitCount(splitCount + 1)}
                >
                  <Text style={styles.splitBtnText}>+</Text>
                </Pressable>
              </View>
              <Text style={styles.splitAmount}>
                Each pays: ₹ {(transaction.amount / splitCount).toFixed(2)}
              </Text>
              <Pressable style={styles.modalBtn} onPress={handleSplitExpense}>
                <Text style={styles.modalBtnText}>Confirm Split</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  header: {
    color: appColors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  backBtn: {
    height: 34,
    width: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: appColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  testBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: appColors.primarySoft,
    borderWidth: 1,
    borderColor: appColors.border,
  },
  testBtnText: {
    color: appColors.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  paymentCard: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 20,
    gap: 14,
    marginBottom: 16,
    alignItems: "center",
  },
  checkmarkContainer: {
    marginBottom: 8,
  },
  alertIconContainer: {
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  trustBadge: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  trustText: {
    fontSize: 13,
    fontWeight: "700",
  },
  fraudReasonBox: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "rgba(225, 82, 82, 0.15)",
    padding: 12,
    flexDirection: "row",
    gap: 8,
  },
  fraudReasonText: {
    color: "#ffc9b2",
    fontSize: 12,
    flex: 1,
    fontWeight: "600",
  },
  detailsBox: {
    width: "100%",
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    color: appColors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  detailValue: {
    color: appColors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  expandBtn: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: appColors.primarySoft,
  },
  expandBtnText: {
    color: appColors.primary,
    fontWeight: "700",
    fontSize: 12,
  },
  txnIdBox: {
    width: "100%",
    backgroundColor: appColors.panel,
    borderRadius: 10,
    padding: 10,
  },
  txnIdText: {
    color: appColors.text,
    fontFamily: "monospace",
    fontSize: 12,
    textAlign: "center",
  },
  actionsRow: {
    width: "100%",
    gap: 10,
  },
  blockBtn: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  blockBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  blockBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },
  proceedBtn: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: appColors.border,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  proceedBtnText: {
    color: appColors.textMuted,
    fontWeight: "700",
    fontSize: 12,
  },
  doneBtn: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: appColors.primary,
    paddingVertical: 14,
    alignItems: "center",
  },
  doneBtnText: {
    color: "#03280f",
    fontWeight: "800",
    fontSize: 14,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    color: appColors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  banksRow: {
    gap: 10,
    marginBottom: 16,
    paddingRight: 16,
  },
  bankOption: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.border,
  },
  bankOptionSelected: {
    backgroundColor: appColors.primarySoft,
    borderColor: appColors.primary,
  },
  bankIconCircle: {
    height: 44,
    width: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  bankCode: {
    color: appColors.text,
    fontSize: 11,
    fontWeight: "700",
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    gap: 8,
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: appColors.panel,
    borderWidth: 1,
    borderColor: appColors.border,
  },
  quickActionText: {
    color: appColors.text,
    fontSize: 11,
    fontWeight: "700",
  },
  transactionsList: {
    gap: 10,
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: appColors.panel,
    borderWidth: 1,
    borderColor: appColors.border,
  },
  txnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  txnInfo: {
    gap: 3,
  },
  txnName: {
    color: appColors.text,
    fontWeight: "700",
    fontSize: 13,
  },
  txnTime: {
    color: appColors.textMuted,
    fontSize: 11,
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
    fontSize: 10,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    borderRadius: 18,
    backgroundColor: appColors.panel,
    borderWidth: 1,
    borderColor: appColors.border,
    padding: 20,
    gap: 12,
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: 12,
    right: 12,
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.primarySoft,
  },
  modalTitle: {
    color: appColors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 12,
  },
  qrCodeBox: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 20,
  },
  qrPlaceholder: {
    color: appColors.textMuted,
    fontSize: 11,
    fontFamily: "monospace",
  },
  modalDesc: {
    color: appColors.textMuted,
    fontSize: 12,
    textAlign: "center",
  },
  modalBtn: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: appColors.primary,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  modalBtnText: {
    color: "#03280f",
    fontWeight: "800",
    fontSize: 13,
  },
  splitContainer: {
    width: "100%",
    gap: 14,
    alignItems: "center",
  },
  splitLabel: {
    color: appColors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  splitControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginVertical: 10,
  },
  splitBtn: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: appColors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  splitBtnText: {
    color: appColors.primary,
    fontSize: 24,
    fontWeight: "800",
  },
  splitCount: {
    color: appColors.text,
    fontSize: 18,
    fontWeight: "800",
    minWidth: 30,
    textAlign: "center",
  },
  splitAmount: {
    color: appColors.primary,
    fontSize: 14,
    fontWeight: "800",
    marginVertical: 8,
  },
});
