// Functions/AuthFunctions.ts
import {
  signIn,
  signUp,
  confirmSignUp,
  resendSignUp,
  resetPassword,
  confirmResetPassword,
} from "aws-amplify/auth";


  // Sign In --------------------------------------------------------------------------------------

  export async function handleSignIn(){
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email and password are required");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    // 
    try {
      const response: any = await authSignIn(email, password);
      console.log("Sign in response", response);
      // 
      if (response.isSignedIn) {
        onSignIn();
      } else if (response.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        Alert.alert("Info", "Please confirm your email using the OTP sent to your inbox.");
        setMode("confirmOtp");
      } else {
        Alert.alert("Error", "Cannot sign in. Please try again.");
      }
    } catch (err: any) {
      console.log("Sign in error", err);
      Alert.alert("Error", err.message || "Failed to sign in");
    }
  };


export async function authSignIn(email: string, password: string) {
  try {
    return await signIn({ username: email, password });
  } catch (err: any) {
    console.error("authSignIn error:", err);
    throw err;
  }
}

/**
 * 🆕 Sign Up new user
 */
export async function authSignUp(email: string, password: string) {
  try {
    return await signUp({
      username: email,
      password,
      attributes: { email },
    });
  } catch (err: any) {
    console.error("authSignUp error:", err);
    throw err;
  }
}

/**
 * ✅ Confirm OTP (Sign Up)
 */
export async function authConfirmSignUp(email: string, otp: string) {
  try {
    return await confirmSignUp({
      username: email,
      confirmationCode: otp,
    });
  } catch (err: any) {
    console.error("authConfirmSignUp error:", err);
    throw err;
  }
}

/**
 * 🔄 Resend OTP (Sign Up only)
 */
export async function authResendSignUp(email: string) {
  try {
    return await resendSignUp(email);
  } catch (err: any) {
    console.error("authResendSignUp error:", err);
    throw err;
  }
}

/**
 * 🔐 Forgot Password → sends reset code
 */
export async function authResetPassword(email: string) {
  try {
    return await resetPassword({ username: email });
  } catch (err: any) {
    console.error("authResetPassword error:", err);
    throw err;
  }
}

/**
 * 🔄 Confirm Reset Password (with OTP)
 */
export async function authConfirmResetPassword(email: string, otp: string, newPassword: string) {
  try {
    return await confirmResetPassword({
      username: email,
      confirmationCode: otp,
      newPassword,
    });
  } catch (err: any) {
    console.error("authConfirmResetPassword error:", err);
    throw err;
  }
}
