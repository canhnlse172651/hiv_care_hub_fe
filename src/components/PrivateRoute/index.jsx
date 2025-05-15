import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "@/constant/path";
import { localToken } from "@/utils/token";

function PrivateRoute() {

  if (!!!localToken.get()) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
