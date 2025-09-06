import { Alert } from "react-native";
import { uiLog } from "../Functions/Logger";

import React from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import TopBar from "./Components/TopBarUI";

import { sync, forceUpload, forceDownload } from "../Functions/SyncFunctions";

// ------------------------------------------------------------------------------------------------

export const SyncUI = ({ path_dict, onLogout }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ Top Bar */}
      <TopBar onLogout={onLogout} />

      {/* ✅ Buttons Section */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#4babdd" }]}
          onPress={() => sync(path_dict)}
        >
          <Image
            source={require("../Icons/CloudSyncIcon.png")}
            style={{ width: 24, height: 24, marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Sync</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#4babdd" }]}
          onPress={() => forceUpload(path_dict)}
        >
          <Image
            source={require("../Icons/CloudUploadIcon.png")}
            style={{ width: 24, height: 24, marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Force Upload</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#4babdd" }]}
          onPress={() => forceDownload(path_dict)}
        >
          <Image
            source={require("../Icons/CloudDownloadIcon.png")}
            style={{ width: 24, height: 24, marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Force Download</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scroll: { padding: 20, gap: 15 },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});



// ------------------------------------------------------------------------------------------------

export function confirmForceUpload(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      "⚠️ Force Upload",
      "This will remove files from S3 that don’t exist locally.\nDo you want to continue?",
      [
        { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
        { text: "Confirm", onPress: () => resolve(true), style: "destructive" },
      ],
      { cancelable: false }
    );
  });
}


export function confirmForceDownload(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      "⚠️ Force Download",
      "This will delete files from your local storage that don’t exist in S3.\nDo you want to continue?",
      [
        { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
        { text: "Confirm", onPress: () => resolve(true), style: "destructive" },
      ],
      { cancelable: false }
    );
  });
}
