
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Replace this with your actual authentication logic
    // For example, check for a token in localStorage
    const isAuthenticated = sessionStorage.getItem('token') !== null;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
