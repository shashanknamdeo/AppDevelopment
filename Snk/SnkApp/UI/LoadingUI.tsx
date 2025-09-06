// UI/LoadingUI.tsx
import React from "react";
import { SafeAreaView, ActivityIndicator, Text, StyleSheet } from "react-native";

export const LoadingUI = () => (
  <SafeAreaView style={styles.center}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text>Loading...</Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
