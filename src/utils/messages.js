const authMessages = {
  "auth/email-already-in-use": "This email is already registered. Please login instead.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/network-request-failed": "Network error. Please check your connection.",
  "auth/invalid-credential": "Incorrect password.",
};

const serviceMessages = {
  "permission-denied": "You do not have permission to perform this action.",
  unavailable: "Network error. Please check your connection.",
  "not-found": "The requested record could not be found.",
  "failed-precondition": "This action is not available yet. Please try again.",
};

const knownFriendlyMessages = new Set([
  "You already applied to this project.",
  "This project no longer exists.",
  "You cannot apply to your own project.",
  "Applications are closed for this project.",
]);

function getCode(error) {
  if (error?.code) return error.code;

  const message = String(error?.message || "");
  const firebaseMatch = message.match(/\((auth\/[^)]+)\)/);
  if (firebaseMatch?.[1]) return firebaseMatch[1];

  return "";
}

export function getAuthErrorMessage(error) {
  return authMessages[getCode(error)] || "Something went wrong. Please try again.";
}

export function getServiceErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const code = getCode(error);
  const message = String(error?.message || "");

  if (serviceMessages[code]) return serviceMessages[code];
  if (message.includes("Firebase is not configured")) {
    return "Firebase is not configured yet. Add your Firebase environment variables and restart the app.";
  }
  if (knownFriendlyMessages.has(message)) return message;
  if (message.includes("offline") || message.includes("network")) return "Network error. Please check your connection.";

  return fallback;
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidUrl(value) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
