import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { profile } = useSelector(state => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const updateAuthState = () => {
      const authDataString = localStorage.getItem('auth');
      const parsedData = authDataString ? JSON.parse(authDataString) : null;
      
      if (profile) {
        setIsAuthenticated(true);
        setCurrentUser(profile);
      } else if (parsedData?.accessToken) {
        setIsAuthenticated(true);
        setCurrentUser(parsedData.user);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    };

    updateAuthState();

    window.addEventListener("storage", updateAuthState);
    return () => {
      window.removeEventListener("storage", updateAuthState);
    };
  }, [profile]);

  return {
    isAuthenticated,
    currentUser,
    userRole: currentUser?.role?.toLowerCase(),
    isPatient: currentUser?.role?.toLowerCase() === 'patient'
  };
}; 