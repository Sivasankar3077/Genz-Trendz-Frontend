import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {

    const { isAuthenticated, loading } = useSelector(
        state => state.user
    );

    const location = useLocation();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "70vh" }}>
                <h5>Loading...</h5>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoutes;