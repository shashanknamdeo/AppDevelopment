// Functions/AutoSyncFunctions.tsx
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import { sync } from "./SyncFunctions";
import { functionLog } from "./Logger";

type AutoSyncOptions = {
  intervalMs?: number;   // default 5 min
  wifiOnly?: boolean;    // default false
  onStatus?: (status: "idle" | "syncing" | "error") => void;
};

export function autoSync( path_dict: any, enabled: boolean, opts: AutoSyncOptions = {} ) {
  functionLog("Initialize Function : autoSync")
  const { intervalMs = 5 * 60 * 1000, wifiOnly = false, onStatus } = opts;

  const isSyncingRef = useRef(false);
  const intervalRef = useRef<any>(null);
  const lastForegroundSyncRef = useRef<number>(0);

  async function doSync() {
    if (!enabled) return;
    if (!path_dict?.local_root_folder_path || !path_dict?.s3_data_folder_path) return;
    if (isSyncingRef.current) return;

    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        functionLog("AutoSync skipped: offline");
        return;
      }
      if (wifiOnly && state.type !== "wifi") {
        functionLog("AutoSync skipped: not on wifi");
        return;
      }
    } catch (e) {
      functionLog("AutoSync NetInfo error", e);
    }

    try {
      isSyncingRef.current = true;
      onStatus?.("syncing");
      functionLog("AutoSync: starting sync()");
      await sync(path_dict);
      functionLog("AutoSync: sync() finished");
      onStatus?.("idle");
    } catch (err) {
      console.error("AutoSync error:", err);
      onStatus?.("error");
    } finally {
      isSyncingRef.current = false;
    }
  }

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Run once immediately
    doSync();

    // Periodic sync
    intervalRef.current = setInterval(() => {
      doSync();
    }, intervalMs);

    // Sync when app foregrounded
    const sub = AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "active") {
        const now = Date.now();
        if (now - lastForegroundSyncRef.current > 30 * 1000) {
          lastForegroundSyncRef.current = now;
          doSync();
        }
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      try {
        sub.remove();
      } catch {}
    };
  }, [enabled, path_dict, intervalMs, wifiOnly]);
functionLog("Terminate Function : autoSync")
}
