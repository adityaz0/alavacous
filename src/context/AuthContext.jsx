import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, firebaseConfigured } from "../firebase/config.js";
import { createUserProfile } from "../services/firestore.js";

const AuthContext = createContext(null);

function requireFirebase() {
  if (!firebaseConfigured || !auth) {
    throw new Error("Firebase is not configured. Add your Vite Firebase environment variables.");
  }
}

function usernameFromEmail(email = "") {
  return email.split("@")[0]?.replace(/[^a-z0-9_]/gi, "").slice(0, 18).toLowerCase() || "builder";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured || !auth) {
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      () => {
        setUser(null);
        setLoading(false);
      }
    );
  }, []);

  async function signup({ name, email, password }) {
    requireFirebase();
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    try {
      await updateProfile(credential.user, { displayName: name });
      await createUserProfile(credential.user.uid, {
        uid: credential.user.uid,
        fullName: name,
        username: usernameFromEmail(email),
        email,
        bio: "",
        skills: [],
        roleTitle: "",
        experienceLevel: "Beginner",
        location: "",
        portfolioUrl: "",
        githubUrl: "",
        linkedinUrl: "",
      });
      return credential.user;
    } catch (error) {
      try {
        await deleteUser(credential.user);
      } catch {
        await signOut(auth).catch(() => {});
      }
      throw error;
    }
  }

  async function login(email, password) {
    requireFirebase();
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }

  async function logout() {
    requireFirebase();
    await signOut(auth);
  }

  async function resetPassword(email) {
    requireFirebase();
    await sendPasswordResetEmail(auth, email);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      firebaseConfigured,
      signup,
      login,
      logout,
      resetPassword,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
