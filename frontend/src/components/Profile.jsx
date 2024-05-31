import React from "react";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import EditProfile from "../pages/EditProfile";
import ViewProfile from "../pages/ViewProfile";
import MyPosts from "../pages/MyPosts";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    navigate("/");

    toast.success("Logged out Successfully", {
      position: "bottom-right",
    });
  };

  const openViewProfileModal = () => {
    document.getElementById("my_modal_10").showModal();
  };
  const openMyPostsModal = () => {
    document.getElementById("my_modal_11").showModal();
  };

  return (
    <div>
      <div className="drawer drawer-end z-50">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Profile image */}
          <label htmlFor="my-drawer-4" className="drawer-button rounded-full">
            {auth?.user?.image?.url && (
              <img
                src={auth?.user?.image?.url}
                alt="Profile"
                className="rounded-full w-16 h-16"
              />
            )}
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content */}
            <li className="py-2">
              <Link to="#" onClick={openViewProfileModal}>
                View Profile
              </Link>
            </li>
            <li className="py-2">
              <Link to="#" onClick={openMyPostsModal}>
                Manage my posts
              </Link>
            </li>
            <li className="py-2">
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
      <ViewProfile />
      <EditProfile />
      <MyPosts />
    </div>
  );
};

export default Profile;
