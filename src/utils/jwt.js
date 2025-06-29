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
 * Check if user has a specific role
 * @param {string} userRole - User's role
 * @param {string} requiredRole - Required role
 * @returns {boolean} Whether user has the required role
 */
export const hasRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  return userRole === requiredRole;
};

/**
 * Check if the user is an admin
 * @param {string} userRole - User's role
 * @returns {boolean} Whether user is admin
 */
export const isAdmin = (userRole) => {
  return userRole === USER_ROLES.ADMIN;
};

/**
 * Check if the user is a doctor
 * @param {string} userRole - User's role
 * @returns {boolean} Whether user is doctor
 */
export const isDoctor = (userRole) => {
  return userRole === USER_ROLES.DOCTOR;
};

/**
 * Check if the user is staff
 * @param {string} userRole - User's role
 * @returns {boolean} Whether user is staff
 */
export const isStaff = (userRole) => {
  return userRole === USER_ROLES.STAFF;
};

/**
 * Check if the user is a patient
 * @param {string} userRole - User's role
 * @returns {boolean} Whether user is patient
 */
export const isPatient = (userRole) => {
  return userRole === USER_ROLES.PATIENT;
};
