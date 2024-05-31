import React from "react";
import { useAuth } from "../context/AuthProvider";
import { FaEdit } from "react-icons/fa";
import EditProfile from "./EditProfile";

const ViewProfile = () => {
  const [auth] = useAuth();

  const handleEditProfile = () => {
    // Logic to handle edit profile, like opening an edit modal or navigating to an edit page

    // Example: Open an edit profile modal
    document.getElementById("my_modal_10").close();
    document.getElementById("my_modal_6").showModal();
  };

  return (
    <dialog id="my_modal_10" className="modal">
      <div className="modal-box bg-white p-6 rounded-lg shadow-md">
        <div className="modal-action flex flex-col items-start justify-center mt-2 mb-2">
          <h2 className="text-3xl font-bold mb-4">My Profile</h2>
          <hr className="border-t border-[#66666645] w-full my-4" />
        </div>
        <div className="flex flex-row items-center justify-between gap-4">
          <div>
            {auth?.user?.image?.url && (
              <img
                src={auth?.user?.image?.url}
                alt="Profile"
                className="rounded-full w-20 h-20"
              />
            )}
          </div>
          <div>
            <p className="text-xl font-bold">{auth?.user?.name}</p>
            <p>{auth?.user?.email}</p>
            <p>{auth?.user?.phone}</p>
          </div>
        </div>
        <hr className="border-t border-[#66666645] w-full my-4" />
        <button
          type="button"
          onClick={() => {
            document.getElementById("my_modal_10").close(); // Close modal on cancel
          }}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleEditProfile}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        </div>
      </div>
      <EditProfile />
    </dialog>
  );
};

export default ViewProfile;
