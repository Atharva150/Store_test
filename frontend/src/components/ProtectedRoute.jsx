import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles = [] }) {
    const {
        user,
        token,
        loading,
        isAuthenticated,
    } = useAuth();

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const role = user?.role;

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(role)
    ) {
        switch (role) {
            case "ADMIN":
                return <Navigate to="/admin" replace />;

            case "OWNER":
                return <Navigate to="/owner" replace />;

            case "USER":
                return <Navigate to="/stores" replace />;

            default:
                return <Navigate to="/login" replace />;
        }
    }

    return children;
}

export default ProtectedRoute;