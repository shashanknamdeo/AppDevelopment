// // UI/ChatUI.tsx
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { GOOGLE_GENAI_API_KEY } from "@env";
// // console.log("API key:", GOOGLE_GENAI_API_KEY);

// interface Message {
//   id: string;
//   text: string;
//   sender: "user" | "bot";
// }

// export function ChatUI({ user, onSignOut }: { user: any; onSignOut: () => void }) {
//   const [messages, setMessages] = useState<Message[]>([
//     { id: "1", text: "Welcome to Gossipy 👋", sender: "bot" },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Initialize Gemini client
//   const genAI = new GoogleGenerativeAI(GOOGLE_GENAI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       text: input,
//       sender: "user",
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const result = await model.generateContent(input);
//       const botReply = result.response.text();

//       setMessages((prev) => [
//         ...prev,
//         { id: Date.now().toString(), text: botReply, sender: "bot" },
//       ]);
//     } catch (error) {
//       console.error("Gemini API Error:", error);
//       setMessages((prev) => [
//         ...prev,
//         { id: Date.now().toString(), text: "⚠️ Error: Failed to fetch AI response.", sender: "bot" },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <View style={styles.header}>
//         <Text style={styles.title}>💬 Gossipy Chat (AI)</Text>
//         <TouchableOpacity onPress={onSignOut}>
//           <Text style={styles.signOut}>Sign Out</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View
//             style={[
//               styles.messageBubble,
//               item.sender === "user" ? styles.userBubble : styles.botBubble,
//             ]}
//           >
//             <Text style={styles.messageText}>{item.text}</Text>
//           </View>
//         )}
//         contentContainerStyle={styles.messagesContainer}
//       />

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type your message..."
//           value={input}
//           onChangeText={setInput}
//         />
//         <TouchableOpacity
//           style={[styles.sendButton, loading && { opacity: 0.5 }]}
//           onPress={sendMessage}
//           disabled={loading}
//         >
//           <Text style={styles.sendText}>{loading ? "..." : "Send"}</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f9f9f9" },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#007AFF",
//     padding: 15,
//   },
//   title: { color: "#fff", fontWeight: "bold", fontSize: 18 },
//   signOut: { color: "#fff", fontSize: 14 },
//   messagesContainer: { padding: 10 },
//   messageBubble: {
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 8,
//     maxWidth: "80%",
//   },
//   userBubble: {
//     backgroundColor: "#007AFF",
//     alignSelf: "flex-end",
//   },
//   botBubble: {
//     backgroundColor: "#e5e5ea",
//     alignSelf: "flex-start",
//   },
//   messageText: { color: "#000" },
//   inputContainer: {
//     flexDirection: "row",
//     borderTopWidth: 1,
//     borderColor: "#ddd",
//     padding: 10,
//     backgroundColor: "#fff",
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 20,
//     paddingHorizontal: 15,
//   },
//   sendButton: {
//     backgroundColor: "#007AFF",
//     borderRadius: 20,
//     marginLeft: 10,
//     paddingHorizontal: 20,
//     justifyContent: "center",
//   },
//   sendText: { color: "#fff", fontWeight: "bold" },
// });


// UI/ChatUI.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { generateText } from "../Functions/GoogleTextGen";

export function ChatUI({ user, onSignOut }: { user: any; onSignOut: () => void }) {
  const [messages, setMessages] = useState([
    { id: "1", text: "Welcome to Gossipy 👋", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const botReply = await generateText(input);
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: botReply, sender: "bot" },
    ]);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.header}>
        <Text style={styles.title}>💬 Gossipy Chat</Text>
        <TouchableOpacity onPress={onSignOut}>
          <Text style={styles.signOut}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === "user" ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && { opacity: 0.5 }]}
          onPress={sendMessage}
          disabled={loading}
        >
          <Text style={styles.sendText}>{loading ? "..." : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#007AFF", padding: 15 },
  title: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  signOut: { color: "#fff", fontSize: 14 },
  messagesContainer: { padding: 10 },
  messageBubble: { padding: 10, marginVertical: 5, borderRadius: 8, maxWidth: "80%" },
  userBubble: { backgroundColor: "#007AFF", alignSelf: "flex-end" },
  botBubble: { backgroundColor: "#e5e5ea", alignSelf: "flex-start" },
  messageText: { color: "#000" },
  inputContainer: { flexDirection: "row", borderTopWidth: 1, borderColor: "#ddd", padding: 10, backgroundColor: "#fff" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 15 },
  sendButton: { backgroundColor: "#007AFF", borderRadius: 20, marginLeft: 10, paddingHorizontal: 20, justifyContent: "center" },
  sendText: { color: "#fff", fontWeight: "bold" },
});
