import { Navigate } from "react-router-dom";
import { localToken } from "@/utils/token";
import { hasRole, USER_ROLES } from "@/utils/jwt";
import { PATHS } from "@/constant/path";

export const StaffRoute = ({ children }) => {
  const tokenData = localToken.get();
  const userId = tokenData?.userId;

  // Check if user is logged in and has staff role
  const isStaff = hasRole(parseInt(userId), USER_ROLES.STAFF);

  if (!tokenData?.accessToken || !isStaff) {
    // Redirect to home page if not authenticated or not a staff
    return <Navigate to={PATHS.HOME} replace />;
  }

  return children;
};

export default StaffRoute;
