import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.user?.name || "",
    email: auth.user?.email || "",
    phone: auth.user?.phone || "",
    password: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(auth.user?.image?.url || "");

  useEffect(() => {
    if (!auth.user) {
      navigate("/login");
    }
  }, [auth.user, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("password", formData.password);

    // Handle image upload if formData.image is set
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const res = await axios.put(
        `http://social-book-mern-stack-api.vercel.app/api/v1/auth/edit-profile/${auth.user._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        const updatedUser = res.data.user;

        // Update auth state with the updated user data
        setAuth({
          ...auth,
          user: updatedUser,
        });

        // Update local storage with the updated auth object
        localStorage.setItem(
          "auth",
          JSON.stringify({ ...auth, user: updatedUser })
        );

        // Close the modal
        document.getElementById("my_modal_6").close();

        // Reset form fields and image preview
        resetForm();

        // Navigate to dashboard or display success message
        navigate("/dashboard");
        toast.success("Profile updated successfully!", {
          position: "top-center",
        });
      } else {
        toast.error(res.data.message, { position: "top-center" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error while updating profile!", { position: "top-center" });
    }
  };

  const resetForm = () => {
    setFormData({
      name: auth.user?.name || "",
      email: auth.user?.email || "",
      phone: auth.user?.phone || "",
      password: "",
      image: null,
    });
    setImagePreview(auth.user?.image?.url || "");
  };

  return (
    <dialog id="my_modal_6" className="modal">
      <div className="modal-box bg-white p-6 rounded-md shadow-md">
        <div className="modal-action flex flex-col items-start justify-center mt-2 mb-2">
          <h2 className="text-3xl font-bold mb-4">Edit Profile</h2>
          <hr className="border-t border-gray-500 w-full my-4" />
          <form onSubmit={handleSubmit} className="space-y-4 form-control">
            <div>
              <label className="block text-lg font-medium py-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-lg font-medium py-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-lg font-medium py-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-lg font-medium py-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-lg font-medium py-2">
                Profile Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="file-input file-input-bordered w-full"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-full"
                  />
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => {
                document.getElementById("my_modal_6").close(); // Close modal on cancel
                resetForm(); // Reset form fields after closing
              }}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default EditProfile;
