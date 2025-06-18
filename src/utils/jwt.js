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
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  STAFF: 'STAFF',
  PATIENT: 'PATIENT'
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
export const hasRole = (userRole, requiredRole) => {
  // Add console.log for debugging
  console.log(`Checking if user with role ${userRole} has required role ${requiredRole}`);
  
  if (!userRole || !requiredRole) return false;
  
  // Direct role comparison since we now have string roles
  return userRole === requiredRole;
};

/**
 * Check if the user is an admin
 */
export const isAdmin = (userRole) => {
  return userRole === USER_ROLES.ADMIN;
};
