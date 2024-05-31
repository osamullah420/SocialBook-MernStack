import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const LoginOTP = ({ email }) => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleVerifyOtp = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/verify-otp",
        { email, otp: data.otp }
      );
      if (res.data.success) {
        document.getElementById("my_modal_5").close();
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: res.data.user,
            token: res.data.token,
          })
        );
        navigate("/dashboard");
        toast.success("Successfully logged in", {
          position: "bottom-right",
        });
      } else {
        toast.error(res.data.message, { position: "top-center" });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message, { position: "top-center" });
      } else {
        toast.error("Error while verifying otp", { position: "top-center" });
      }
    }
  };

  return (
    <dialog id="my_modal_5" className="modal">
      <form onSubmit={handleSubmit(handleVerifyOtp)} className="modal-box">
        <div className="modal-action flex flex-col items-center justify-center mt-2 mb-2">
          <h3 className=" text-3xl font-bold py-6">Verify OTP</h3>
          <hr className="border-t-2 border-gray-300 my-4" />
          <p className="text-xl font-semibold text-center py-4">
            OTP has been sent to:{" "}
            <span className="text-[#0866ff]">{email}</span>
          </p>
          <div className="w-full form-control">
            <input
              type="text"
              placeholder="Enter OTP"
              className="input input-bordered text-2xl"
              {...register("otp", { required: true })}
            />
            {errors.otp && <p className="text-red-500">OTP is required</p>}
          </div>
          <button
            type="submit"
            className="btn text-2xl text-white mt-4 bg-[#0866ff] w-full"
          >
            Verify
          </button>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById("my_modal_5").close()}
          >
            X
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default LoginOTP;
