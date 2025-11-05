import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Amplify } from "aws-amplify";
import { getCurrentUser, signOut } from "aws-amplify/auth";

// Local imports
import awsExports from "./aws-exports";
import { AuthUI } from "./UI/AuthUI";
import { LoadingUI } from "./UI/LoadingUI";
import { ChatUI } from "./UI/ChatUI"; // 👈 NEW import

// Initialize Amplify with your AWS config
Amplify.configure(awsExports);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check login status when app starts
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setSignedIn(true);
          setUser(currentUser);
        }
      } catch {
        setSignedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Handle logout
  async function handleSignOut() {
    try {
      await signOut();
      setSignedIn(false);
      setUser(null);
    } catch (err: any) {
      console.error("Sign out error:", err);
    }
  }

  // Handle successful login
  function handleSignInSuccess() {
    setSignedIn(true);
  }

  // Loading state
  if (loading) {
    return <LoadingUI />;
  }

  // If not signed in → show authentication UI
  if (!signedIn) {
    return (
      <SafeAreaProvider>
        <AuthUI onSignIn={handleSignInSuccess} />
      </SafeAreaProvider>
    );
  }

  // ✅ If signed in → show chat page
  return (
    <SafeAreaProvider>
      <ChatUI user={user} onSignOut={handleSignOut} />
    </SafeAreaProvider>
  );
}
