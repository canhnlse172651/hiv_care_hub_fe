/**
 * JWT Token Decoder
 * Decodes JWT tokens without validation
 */
export const decodeJwt = (token) => {
  try {
    if (!token) return null;
    
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload part (second part)
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode using atob and parse as JSON
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding JWT:', e);
    return null;
  }
};

// Define user roles as constants
export const USER_ROLES = {
  ADMIN: 1,
  DOCTOR: 5,
  STAFF: 3,
  PATIENT: 7
};

/**
 * Get the role of a user from the userId
 * In this example, we're using a simple mapping from userId to role
 */
export const getUserRole = (userId) => {
  // This is a simplified example
  // In a real app, you'd decode this from JWT or get it from user object
  switch (userId) {
    case 1:
      return 'admin';
    case 5:
      return 'doctor';
    case 3:
      return 'staff';
    case 7:
      return 'patient';
    default:
      return 'user'; // Default role
  }
};

/**
 * Check if user has a specific role
 */
export const hasRole = (userId, requiredRole) => {
  // Add console.log for debugging
  console.log(`Checking if user ${userId} has role ${requiredRole}`);
  
  // For admin specific check
  if (requiredRole === USER_ROLES.ADMIN) {
    const isAdminUser = userId === 1;
    console.log(`Is admin? ${isAdminUser}`);
    return isAdminUser;
  }
  
  // For staff specific check
  if (requiredRole === USER_ROLES.STAFF) {
    const isStaffUser = userId === 3;
    console.log(`Is staff? ${isStaffUser}`);
    return isStaffUser;
  }
  
  // For patient specific check
  if (requiredRole === USER_ROLES.PATIENT) {
    const isPatient = userId === 7;
    console.log(`Is patient? ${isPatient}`);
    return isPatient;
  }

  // For admin specific check
  if (requiredRole === USER_ROLES.DOCTOR) {
    const isDoctor = userId === 5;
    console.log(`Is doctor? ${isDoctor}`);
    return isDoctor;
  }
  
  // Add other role checks as needed
  return false;
};

/**
 * Check if the user is an admin
 */
export const isAdmin = (token) => {
  // In a real app you'd decode the JWT token and check the role
  // For now, we're just using a simple check based on token existence
  return !!token; 
};
