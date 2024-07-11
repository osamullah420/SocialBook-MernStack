import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const Registeration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [imagePreview, setImagePreview] = useState(null);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      formData.append("image", data.image[0]);

      const res = await axios.post(
        "http://social-book-mern-stack-api.vercel.app/api/v1/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        document.getElementById("my_modal_1").close(); // Close modal after successful registration
        toast.success(res.data.message, { position: "bottom-right" });
        reset(); // Reset form fields after successful submission
        setImagePreview(null); // Reset image preview
      } else {
        toast.error(res.data.message, { position: "bottom-right" });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Error while registering user", { position: "bottom-right" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <dialog id="my_modal_1" className="modal modal-middle sm:modal-middle">
      <div className="modal-box">
        <div className="modal-action flex flex-col items-start justify-start mt-0">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold">Sign Up</h2>
            <p className="text-xl">It's Quick and Easy.</p>
            <hr className="border-t-2 border-gray-300 my-4" />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="w-full form-control">
                <input
                  type="text"
                  placeholder="Name"
                  className="input input-bordered text-xl"
                  {...register("name", {
                    required: true,
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message:
                        "Name cannot Contains numbers or special Characters",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="w-full form-control">
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered text-xl"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-red-500">Email is required</p>
                )}
              </div>
              <div className="w-full form-control">
                <input
                  type="text"
                  placeholder="Phone"
                  className="input input-bordered text-xl"
                  {...register("phone", { required: true })}
                />
                {errors.phone && (
                  <p className="text-red-500">Phone is required</p>
                )}
              </div>
              <div className="w-full form-control">
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered text-xl"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <p className="text-red-500">Password is required</p>
                )}
              </div>
              <div className="w-full form-control">
                <input
                  type="file"
                  className="file-input file-input-bordered text-xl"
                  {...register("image", { required: true })}
                  onChange={handleImageChange}
                />
                {errors.image && (
                  <p className="text-red-500 ">Profile picture is required</p>
                )}
              </div>
              {imagePreview && (
                <div className="w-full flex justify-center mt-4">
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
              )}
              <button
                type="submit"
                className="btn text-2xl text-white mt-4 bg-[#0866ff] w-full"
              >
                Sign Up
              </button>
            </form>
          </div>
          <button
            onClick={() => {
              document.getElementById("my_modal_1").close(); // Close modal on cancel
              reset(); // Reset form fields after closing
              setImagePreview(null); // Reset image preview
            }}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default Registeration;
