import React from "react";
import { Navigate, Outlet } from "react-router";

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("token"); // Check if token exists

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
