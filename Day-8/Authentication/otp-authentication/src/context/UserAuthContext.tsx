import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  User,
  UserCredential,
  ConfirmationResult,
  Auth,
} from "firebase/auth";
import { auth } from "../firebase";

interface AuthContextType {
  user: User | null;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  googleSignIn: () => Promise<UserCredential>;
  setUpRecaptcha: (number: string) => Promise<ConfirmationResult>;
  resetRecaptcha: () => void;
}

const userAuthContext = createContext<AuthContextType | undefined>(undefined);

export function UserAuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  const logIn = useCallback((email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback((email: string, password: string): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const logOut = useCallback((): Promise<void> => {
    return signOut(auth);
  }, []);

  const googleSignIn = useCallback((): Promise<UserCredential> => {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }, []);

  const resetRecaptcha = useCallback(() => {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      setRecaptchaVerifier(null);
    }
  }, [recaptchaVerifier]);

  const setUpRecaptcha = useCallback(async (number: string): Promise<ConfirmationResult> => {
    try {
      // Clear previous recaptcha if exists
      resetRecaptcha();

      const container = document.getElementById("recaptcha-container");
      if (!container) throw new Error("reCAPTCHA container not found");

      const newRecaptchaVerifier = new RecaptchaVerifier(
        container,
        {
          size: "normal", // or "invisible" for better UX
          theme: "light",
          callback: () => {console.log("reCAPTCHA solved");},
        },
        auth
      );

      await newRecaptchaVerifier.render();
      setRecaptchaVerifier(newRecaptchaVerifier);

      return await signInWithPhoneNumber(auth, number, newRecaptchaVerifier);
    } catch (error) {
      resetRecaptcha();
      console.error("reCAPTCHA setup failed:", error);
      throw error;
    }
  }, [resetRecaptcha]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
      resetRecaptcha();
    };
  }, [resetRecaptcha]);

  return (
    <userAuthContext.Provider
      value={{
        user,
        logIn,
        signUp,
        logOut,
        googleSignIn,
        setUpRecaptcha,
        resetRecaptcha,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth(): AuthContextType {
  const context = useContext(userAuthContext);
  if (context === undefined) {
    throw new Error("useUserAuth must be used within a UserAuthContextProvider");
  }
  return context;
}