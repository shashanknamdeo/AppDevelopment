import { appLog } from "./Functions/Logger";
appLog("Initialize App -------------------------------------------------------------------------------------");

// import React, { useEffect, useState } from "react";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { Amplify } from "aws-amplify";
// import { getCurrentUser, signOut } from "aws-amplify/auth";

// // Local imports
// import awsExports from "./aws-exports";
// import { AuthUI } from "./UI/AuthUI";
// import { LoadingUI } from "./UI/LoadingUI";
// import { ChatUI } from "./UI/ChatUI"; // 👈 NEW import

// // Initialize Amplify with your AWS config
// Amplify.configure(awsExports);

// export default function App() {
//   const [loading, setLoading] = useState(true);
//   const [signedIn, setSignedIn] = useState(false);
//   const [user, setUser] = useState<any>(null);

//   // Check login status when app starts
//   useEffect(() => {
//     const checkUser = async () => {
//       try {
//         const currentUser = await getCurrentUser();
//         if (currentUser) {
//           setSignedIn(true);
//           setUser(currentUser);
//         }
//       } catch {
//         setSignedIn(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkUser();
//   }, []);

//   // Handle logout
//   async function handleSignOut() {
//     try {
//       await signOut();
//       setSignedIn(false);
//       setUser(null);
//     } catch (err: any) {
//       console.error("Sign out error:", err);
//     }
//   }

//   // Handle successful login
//   function handleSignInSuccess() {
//     setSignedIn(true);
//   }

//   // Loading state
//   if (loading) {
//     return <LoadingUI />;
//   }

//   // If not signed in → show authentication UI
//   if (!signedIn) {
//     return (
//       <SafeAreaProvider>
//         <AuthUI onSignIn={handleSignInSuccess} />
//       </SafeAreaProvider>
//     );
//   }

//   // ✅ If signed in → show chat page
//   return (
//     <SafeAreaProvider>
//       <ChatUI user={user} onSignOut={handleSignOut} />
//     </SafeAreaProvider>
//   );
// }

// import { appLog } from "./Functions/Logger";

// appLog('Initialize App -------------------------------------------------------------------------------------')

// import React, { useEffect, useState } from "react";
// import { Amplify } from "aws-amplify";
// import awsExports from "./aws-exports";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
// import { getCurrentUser, signOut } from "aws-amplify/auth";

// // Local UI imports
// import { AuthUI } from "./UI/AuthUI";
// import { LoadingUI } from "./UI/LoadingUI";
// import { ChatUI } from "./UI/ChatUI";
// import { TalkUI } from "./UI/TalkUI";

// Amplify.configure(awsExports);

// appLog('All Packages Imported ------------------------------------------------------------------------------')

// export default function App() {
//   const [loading, setLoading] = useState(true);
//   const [signedIn, setSignedIn] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const [mode, setMode] = useState<"chat" | "talk">("chat");

//   // Check login status once after mount
//   useEffect(() => {
//     const checkUser = async () => {
//       try {
//         const currentUser = await getCurrentUser();
//         if (currentUser) {
//           setSignedIn(true);
//           setUser(currentUser);
//         }
//       } catch {
//         setSignedIn(false);
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkUser();
//   }, []);

//   // Logout handler
//   async function handleSignOut() {
//     try {
//       await signOut();
//       setSignedIn(false);
//       setUser(null);
//     } catch (err: any) {
//       console.error("Sign out error:", err);
//     }
//   }

//   // Login success handler
//   function handleSignInSuccess() {
//     setSignedIn(true);
//   }

//   // Loading state
//   if (loading) return <LoadingUI />;

//   // Authentication screen
//   if (!signedIn) {
//     return (
//       <SafeAreaProvider>
//         <AuthUI onSignIn={handleSignInSuccess} />
//       </SafeAreaProvider>
//     );
//   }

//   // Main app view with chat/talk switch
//   return (
//     <SafeAreaProvider>
//       {mode === "chat" ? (
//         <ChatUI user={user} onSignOut={handleSignOut} />
//       ) : (
//         <TalkUI onBack={() => setMode("chat")} />
//       )}

//       {/* 🔁 Switch Button */}
//       <View style={styles.switchContainer}>
//         <TouchableOpacity
//           style={styles.switchButton}
//           onPress={() => setMode(mode === "chat" ? "talk" : "chat")}
//         >
//           <Text style={styles.switchText}>
//             {mode === "chat" ? "🎙️ Switch to Talk" : "💬 Switch to Chat"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   switchContainer: {
//     position: "absolute",
//     bottom: 40,
//     alignSelf: "center",
//   },
//   switchButton: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 10,
//     paddingHorizontal: 25,
//     borderRadius: 20,
//   },
//   switchText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

// ------------------------------------------------------------------------------------------------


// import React, { useEffect, useState } from "react";
// import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { Amplify } from "aws-amplify";
// import { getCurrentUser, signOut } from "aws-amplify/auth";
// import awsExports from "./aws-exports";

// // 🧩 Local UI imports
// import { AuthUI } from "./UI/AuthUI";
// import { LoadingUI } from "./UI/LoadingUI";
// import { ChatUI } from "./UI/ChatUI";
// import { TalkUI } from "./UI/TalkUI";

// // ✅ Configure Amplify
// Amplify.configure(awsExports);

// appLog("All Packages Imported ------------------------------------------------------------------------------");

// export default function App() {
//   const [loading, setLoading] = useState(true);
//   const [signedIn, setSignedIn] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const [mode, setMode] = useState<"chat" | "talk">("chat");

//   // ✅ Check login status once after mount
//   useEffect(() => {
//     const checkUser = async () => {
//       try {
//         const currentUser = await getCurrentUser();
//         if (currentUser) {
//           setSignedIn(true);
//           setUser(currentUser);
//           appLog("✅ User session active");
//         }
//       } catch {
//         setSignedIn(false);
//         appLog("❌ No user session found");
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkUser();
//   }, []);

//   // ✅ Logout handler
//   async function handleSignOut() {
//     try {
//       await signOut();
//       setSignedIn(false);
//       setUser(null);
//       appLog("👋 User signed out");
//     } catch (err: any) {
//       console.error("Sign out error:", err);
//     }
//   }

//   // ✅ Login success handler
//   function handleSignInSuccess() {
//     setSignedIn(true);
//     appLog("🔐 User signed in successfully");
//   }

//   // ✅ Loading state
//   if (loading) return <LoadingUI />;

//   // ✅ Authentication screen
//   if (!signedIn) {
//     return (
//       <SafeAreaProvider>
//         <AuthUI onSignIn={handleSignInSuccess} />
//       </SafeAreaProvider>
//     );
//   }

//   // ✅ Main app view (Chat ↔ Talk toggle)
//   return (
//     <SafeAreaProvider>
//       {mode === "chat" ? (
//         <ChatUI user={user} onSignOut={handleSignOut} />
//       ) : (
//         <TalkUI onBack={() => setMode("chat")} />
//       )}

//       {/* 🔁 Toggle Button */}
//       <View style={styles.switchContainer}>
//         <TouchableOpacity
//           style={styles.switchButton}
//           onPress={() => {
//             const nextMode = mode === "chat" ? "talk" : "chat";
//             setMode(nextMode);
//             appLog(`🔄 Switched to ${nextMode.toUpperCase()} mode`);
//           }}
//         >
//           <Text style={styles.switchText}>
//             {mode === "chat" ? "🎙️ Switch to Talk" : "💬 Switch to Chat"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaProvider>
//   );
// }

// // ------------------ Styles ------------------
// const styles = StyleSheet.create({
//   switchContainer: {
//     position: "absolute",
//     bottom: 40,
//     alignSelf: "center",
//   },
//   switchButton: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 4,
//   },
//   switchText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });


import { TestAudioRecorder } from "./UI/TestAudioRecorder";

export default function App() {
  return <TestAudioRecorder />;
}