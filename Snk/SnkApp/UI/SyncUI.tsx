import { Alert } from "react-native";
import { uiLog } from "../Functions/Logger";

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
