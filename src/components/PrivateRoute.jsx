
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('jwtToken');  // Simple check if the token exists

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
