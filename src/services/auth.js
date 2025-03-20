import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Register a new user
export const registerUser = async (email, password, username) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create a user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      createdAt: new Date().toISOString(),
    });
    
    return { user };
  } catch (error) {
    return { error };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    return { error };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Get current user data
export const getCurrentUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { userData: userDoc.data() };
    } else {
      return { error: "User not found" };
    }
  } catch (error) {
    return { error };
  }
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Update user nickname (username)
export const updateUserNickname = async (userId, newUsername) => {
  try {
    // Update the username in Firestore
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      username: newUsername,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Reauthenticate the user (required for sensitive operations like password change)
export const reauthenticateUser = async (currentPassword) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    
    await reauthenticateWithCredential(user, credential);
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Update user password
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    
    // First reauthenticate
    const { success, error } = await reauthenticateUser(currentPassword);
    if (!success) {
      return { error: error || "Authentication failed" };
    }
    
    // Then update password
    await updatePassword(user, newPassword);
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Send password reset email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { error };
  }
};
