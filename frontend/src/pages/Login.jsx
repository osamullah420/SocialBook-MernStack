import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Registeration from "./Registeration";
import ForgetOTP from "./ForgetOTP";
import LoginOTP from "./LoginOTP";

const Login = () => {
  const [email, setEmail] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleLogin = async (data) => {
    try {
      const res = await axios.post(
        "http://social-book-mern-stack-api.vercel.app/api/v1/auth/login",
        data
      );
      if (res.data.success) {
        setEmail(data.email); // Ensure email is set
        document.getElementById("my_modal_5").showModal();
        toast.success("OTP sent to email", { position: "bottom-right" });
      } else {
        toast.error(res.data.message, { position: "top-center" });
      }
    } catch (error) {
      // Check the response for specific error messages
      if (error.response && error.response.data) {
        toast.error(error.response.data.message, { position: "top-center" });
      } else {
        toast.error("Error while login", { position: "top-center" });
      }
    }
  };

  return (
    <div className="section-container bg-gradient-to-r from-[#FAFAFA] from-0% to-[#FCFCFC] to-100%">
      <div className="py-24 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="md:w-1/2 space-y-7 px-4">
          <h2 className="md:text-7xl text-4xl font-bold md:leading-snug leading-snug text-[#0866ff]">
            SocialBook
          </h2>
          <p className="text-3xl font-semibold text-[#201e21] md:leading-snug leading-snug">
            SocialBook helps you connect and share with the people in your life.
          </p>
        </div>

        <div className="md:w-1/2 space-y-7 px-4">
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="bg-base-100 shadow-xl flex flex-col justify-center space-y-4 mt-4 items-center px-8 py-16 border-[2px] rounded-md"
          >
            <div className="w-full form-control">
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered text-2xl"
                {...register("email", {
                  required: true,
                  onChange: (e) => setEmail(e.target.value),
                })}
              />
              {errors.email && (
                <p className="text-red-500">Email is required</p>
              )}
            </div>
            <div className="w-full form-control">
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered text-2xl"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p className="text-red-500">Password is required</p>
              )}
            </div>
            <button
              type="submit"
              className="btn text-2xl text-white mt-4 bg-[#0866ff] w-full"
            >
              Login
            </button>
            <a
              href="#"
              className="text-[#4082ff] text-xl cursor-pointer mt-2"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("my_modal_2").showModal();
              }}
            >
              Forgot Password?
            </a>
            <button
              type="button"
              onClick={() => {
                document.getElementById("my_modal_1").showModal();
              }}
              className="btn text-2xl text-white mt-4 px-10 bg-[#42b72a]"
            >
              Create an Account
            </button>
          </form>
        </div>
      </div>

      <ForgetOTP />
      <LoginOTP email={email} />
      <Registeration />
    </div>
  );
};

export default Login;
