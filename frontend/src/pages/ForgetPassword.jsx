import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgetPassword = ({ email }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleChangePassword = async (data) => {
    try {
      const res = await axios.post(
        "http://social-book-mern-stack-api.vercel.app/api/v1/auth/verify-otp-reset-password",
        { email, otp: data.otp, newPassword: data.newPassword }
      );
      if (res.data.success) {
        document.getElementById("my_modal_3").close();
        navigate("/");
        toast.success("Password changed Successfully", {
          position: "bottom-right",
        });
      } else {
        toast.error(res.data.message, { position: "top-center" });
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while changing password!", { position: "top-center" });
    }
  };

  return (
    <dialog id="my_modal_3" className="modal modal-middle sm:modal-middle">
      <div className="modal-box">
        <div className="modal-action flex flex-col items-center justify-center mt-0">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Reset Password</h2>
            <hr className="border-t-2 border-gray-300 my-4" />
            <form
              onSubmit={handleSubmit(handleChangePassword)}
              className="space-y-4"
            >
              <div className="w-full form-control">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="input input-bordered text-xl"
                  {...register("otp", { required: true })}
                />
                {errors.otp && <p className="text-red-500">OTP is required</p>}
              </div>
              <div className="w-full form-control">
                <input
                  type="password"
                  placeholder="Enter New Password"
                  className="input input-bordered text-xl"
                  {...register("newPassword", { required: true })}
                />
                {errors.newPassword && (
                  <p className="text-red-500">New Password is required</p>
                )}
              </div>
              <button
                type="submit"
                className="btn text-2xl text-white mt-4 bg-[#0866ff] w-full"
              >
                Reset Password
              </button>
            </form>
          </div>
          <button
            onClick={() => {
              document.getElementById("my_modal_3").close();
              reset(); // Reset form fields after closing
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

export default ForgetPassword;
