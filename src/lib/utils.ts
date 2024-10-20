export const parseFirebaseAuthError = (errorMessage: string) => {
  // Try to match the error code inside parentheses
  const match = errorMessage.match(/\(([^)]+)\)/);

  // If no match is found, return the original error message
  if (!match) {
    return errorMessage;
  }

  // Extract the error code from the matched result
  const errorCode = match[1];

  // Switch statement to return parsed error messages based on the error code
  switch (errorCode) {
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/invalid-credential":
      return "Credentials are not valid. Please try again.";
    case "auth/user-disabled":
      return "This user account has been disabled.";
    case "auth/user-not-found":
      return "No user found with this email address.";
    case "auth/wrong-password":
      return "The password is incorrect.";
    case "auth/email-already-in-use":
      return "This email is already in use by another account.";
    case "auth/weak-password":
      return "The password is too weak. Please choose a stronger password.";
    case "auth/too-many-requests":
      return "Access to this account has been temporarily disabled due to too many login attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    default:
      console.log("Firebase errorCode", errorCode);
      return "An unknown error occurred. Please try again.";
  }
};
