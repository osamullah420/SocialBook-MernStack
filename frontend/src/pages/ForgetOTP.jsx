import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import ForgetPassword from "./ForgetPassword";

const ForgetOTP = () => {
  const [email, setEmail] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleResetOtp = async (data) => {
    try {
      const res = await axios.post(
        "http://social-book-mern-stack-api.vercel.app/api/v1/auth/request-password-reset",
        data
      );
      if (res.data.success) {
        setEmail(data.email);
        document.getElementById("my_modal_2").close();
        document.getElementById("my_modal_3").showModal();

        toast.success("Otp sent Successfully", {
          position: "bottom-right",
        });
      } else {
        toast.error(res.data.message, { position: "top-center" });
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while sending otp!", { position: "top-center" });
    }
  };

  return (
    <dialog id="my_modal_2" className="modal modal-middle sm:modal-middle">
      <div className="modal-box">
        <div className="modal-action flex flex-col items-center justify-center mt-0">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Provide Email for OTP</h2>
            <hr className="border-t-2 border-gray-300 my-4" />
            <form onSubmit={handleSubmit(handleResetOtp)} className="space-y-4">
              <div className="w-full form-control">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="input input-bordered text-xl"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-red-500">Email is required</p>
                )}
              </div>

              <button
                type="submit"
                className="btn text-2xl text-white mt-4 bg-[#0866ff] w-full"
              >
                Send OTP
              </button>
            </form>
          </div>
          <button
            onClick={() => {
              document.getElementById("my_modal_2").close();
              reset(); // Reset form fields after closing
            }}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </div>
      </div>
      <ForgetPassword email={email} />
    </dialog>
  );
};

export default ForgetOTP;
