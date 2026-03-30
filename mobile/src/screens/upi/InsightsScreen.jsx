import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";

export default function InsightsScreen() {
  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>Insights</Text>
        <Text style={styles.text}>Spend intelligence and fraud analytics snapshots appear here.</Text>
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
});
