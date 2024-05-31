import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const PrivateRoutes = ({ children }) => {
  const [auth] = useAuth();
  const location = useLocation();

  console.log("my auth", auth);

  if (auth.loading) {
    return <Spinner />;
  }

  if (!auth.user) {
    return children;
  } else {
    return <Navigate to="dashboard" state={{ from: location }} replace />;
  }
};

export default PrivateRoutes;
