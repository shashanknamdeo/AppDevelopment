import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import TopBar from "./Components/TopBarUI";
import { autoSync } from "../Functions/AutoSyncFunctions";
import { sync, forceUpload, forceDownload } from "../Functions/SyncFunctions";

export const SyncUI = ({ path_dict, onLogout }: any) => {
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [status, setStatus] = useState<"idle" | "syncing" | "error">("idle");
  const [intervalMs, setIntervalMs] = useState(5 * 60 * 1000); // default 5 min
  const [intervalPopupVisible, setIntervalPopupVisible] = useState(false);

  // AutoSync Hook
  autoSync(path_dict, autoSyncEnabled, {
    intervalMs,
    wifiOnly: false,
    onStatus: setStatus,
  });

  // Convert intervalMs to d/h/m/s
  const msToDHMS = (ms: number) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = msToDHMS(intervalMs);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <TopBar onLogout={onLogout} />

      {/* AutoSync Settings */}
      <View style={styles.autoSyncRow}>
        <Text style={styles.autoSyncLabel}>Auto Sync</Text>
        <Switch value={autoSyncEnabled} onValueChange={setAutoSyncEnabled} />
      </View>
      <Text style={styles.statusText}>Status: {status}</Text>

      {/* Interval Selector */}
      {autoSyncEnabled && (
        <TouchableOpacity
          style={styles.intervalRow}
          onPress={() => setIntervalPopupVisible(true)}
        >
          <Text style={styles.autoSyncLabel}>Interval</Text>
          <Text>{`${days}d ${hours}h ${minutes}m ${seconds}s`}</Text>
        </TouchableOpacity>
      )}

      {/* Interval Modal */}
      <Modal visible={intervalPopupVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Set Interval</Text>

            {["Days", "Hours", "Minutes", "Seconds"].map((label, index) => {
              const values = [days, hours, minutes, seconds];
              const setters = [
                (val: number) => setIntervalMs(prev => val * 24 * 60 * 60 * 1000 + prev % (24 * 60 * 60 * 1000)),
                (val: number) => setIntervalMs(prev => val * 60 * 60 * 1000 + prev % (60 * 60 * 1000)),
                (val: number) => setIntervalMs(prev => val * 60 * 1000 + prev % (60 * 1000)),
                (val: number) => setIntervalMs(prev => val * 1000 + prev % 1000),
              ];
              return (
                <View key={index} style={styles.modalRow}>
                  <Text>{label}:</Text>
                  <TextInput
                    style={styles.modalInput}
                    keyboardType="number-pad"
                    value={String(values[index])}
                    onChangeText={(val) => {
                      const num = Number(val) || 0;
                      let totalMs =
                        (index === 0 ? num * 24 * 60 * 60 * 1000 : days * 24 * 60 * 60 * 1000) +
                        (index === 1 ? num * 60 * 60 * 1000 : hours * 60 * 60 * 1000) +
                        (index === 2 ? num * 60 * 1000 : minutes * 60 * 1000) +
                        (index === 3 ? num * 1000 : seconds * 1000);
                      setIntervalMs(totalMs);
                    }}
                  />
                </View>
              );
            })}

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIntervalPopupVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIntervalPopupVisible(false)}
              >
                <Text>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Buttons Section */}
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
  container: { flex: 1 },
  scroll: { padding: 16 },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  autoSyncRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  autoSyncLabel: { fontSize: 16, fontWeight: "500" },
  statusText: { paddingHorizontal: 16, marginBottom: 8, color: "#555" },
  intervalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    width: 60,
    textAlign: "center",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalButton: { padding: 10 },
});


// export const SyncUI = ({ path_dict, onLogout }: any) => {
//   const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
//   const [status, setStatus] = useState<"idle" | "syncing" | "error">("idle");

//   // ✅ AutoSync Hook
//   autoSync(path_dict, autoSyncEnabled, {
//     intervalMs: 5 * 60 * 1000, // every 5 min
//     wifiOnly: false,
//     onStatus: setStatus,
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* ✅ Top Bar */}
//       <TopBar onLogout={onLogout} />

//       {/* ✅ AutoSync Toggle */}
//       <View style={styles.autoSyncRow}>
//         <Text style={styles.autoSyncLabel}>Auto Sync</Text>
//         <Switch value={autoSyncEnabled} onValueChange={setAutoSyncEnabled} />
//       </View>
//       <Text style={styles.statusText}>Status: {status}</Text>

//       {/* ✅ Buttons Section */}
//       <ScrollView contentContainerStyle={styles.scroll}>
//         <TouchableOpacity
//           style={[styles.actionButton, { backgroundColor: "#4babdd" }]}
//           onPress={() => sync(path_dict)}
//         >
//           <Image
//             source={require("../Icons/CloudSyncIcon.png")}
//             style={{ width: 24, height: 24, marginRight: 8 }}
//           />
//           <Text style={styles.buttonText}>Sync</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.actionButton, { backgroundColor: "#4babdd" }]}
//           onPress={() => forceUpload(path_dict)}
//         >
//           <Image
//             source={require("../Icons/CloudUploadIcon.png")}
//             style={{ width: 24, height: 24, marginRight: 8 }}
//           />
//           <Text style={styles.buttonText}>Force Upload</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.actionButton, { backgroundColor: "#4babdd" }]}
//           onPress={() => forceDownload(path_dict)}
//         >
//           <Image
//             source={require("../Icons/CloudDownloadIcon.png")}
//             style={{ width: 24, height: 24, marginRight: 8 }}
//           />
//           <Text style={styles.buttonText}>Force Download</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scroll: {
//     padding: 16,
//   },
//   actionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   autoSyncRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   autoSyncLabel: {
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   statusText: {
//     paddingHorizontal: 16,
//     marginBottom: 8,
//     color: "#555",
//   },
// });




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
