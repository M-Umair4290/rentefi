import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');
    console.log('Access token in PrivateRoute:', token); // Debug log

    // Check if access token exists
    if (!token) {
        console.log('No access token found, redirecting to login');
        return <Navigate to="/login" />;
    }

    console.log('Access token found, rendering protected route');
    return children;
};

export default PrivateRoute;