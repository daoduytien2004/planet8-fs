import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const isAuthenticated = authService.isAuthenticated();
    const isAdmin = authService.isAdmin();

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Admin required but user is not admin - redirect to home
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    // All checks passed - render children
    return children;
};

export default ProtectedRoute;
