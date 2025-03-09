import React, { createContext, useContext, useState, useEffect } from "react";
import { subscribeToAuthChanges, getCurrentUserData } from "../services/auth";

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Get additional user data from Firestore
        const { userData, error } = await getCurrentUserData(user.uid);
        if (!error) {
          setUserData(userData);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    userData,
    setUserData, // Add setUserData to the context value
    isAuthenticated: !!currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
