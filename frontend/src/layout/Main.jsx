import React from "react";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Main = () => {
  return (
    <div>
      <div className="min-h-screen">
        <Outlet />
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Main;
