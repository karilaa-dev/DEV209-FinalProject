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
import { handleServiceError } from "./utils";

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
    return handleServiceError(error, "Error registering user");
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    return handleServiceError(error, "Error logging in user");
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return handleServiceError(error, "Error logging out user");
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
    return handleServiceError(error, "Error getting user data");
  }
};

/**
 * Subscribe to authentication state changes
 * @param {function} callback - The callback function to execute when the auth state changes
 * @returns {function} - The unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Update user nickname (username)
 * @param {string} userId - The ID of the user to update
 * @param {string} newUsername - The new username
 * @returns {Promise<object>} - Promise that resolves with a success flag
 */
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
    return handleServiceError(error, "Error updating user nickname");
  }
};

/**
 * Reauthenticate the user (required for sensitive operations like password change)
 * @param {string} currentPassword - The user's current password
 * @returns {Promise<object>} - Promise that resolves with a success flag
 */
export const reauthenticateUser = async (currentPassword) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    
    await reauthenticateWithCredential(user, credential);
    return { success: true };
  } catch (error) {
    return handleServiceError(error, "Error reauthenticating user");
  }
};

/**
 * Update user password
 * @param {string} currentPassword - The user's current password
 * @param {string} newPassword - The new password
 * @returns {Promise<object>} - Promise that resolves with a success flag
 */
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
    return handleServiceError(error, "Error updating user password");
  }
};

/**
 * Send password reset email
 * @param {string} email - The email address to send the reset password email to
 * @returns {Promise<object>} - Promise that resolves with a success flag
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return handleServiceError(error, "Error sending password reset email");
  }
};
