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

  if (auth.user) {
    return children;
  } else {
    toast.info("Login is required to access this page", {
      position: "top-center",
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }
};

export default PrivateRoutes;
