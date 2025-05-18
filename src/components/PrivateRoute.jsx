import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    console.log('Current user in PrivateRoute:', user); // Debug log

    // Check if user exists and is an admin
    if (!user) {
        console.log('No user found, redirecting to login');
        return <Navigate to="/login" />;
    }

    if (user.role !== 'admin') {
        console.log('User is not an admin, redirecting to login');
        return <Navigate to="/login" />;
    }

    console.log('User authenticated, rendering protected route');
    return children;
};

export default PrivateRoute;