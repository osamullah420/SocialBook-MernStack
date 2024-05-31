import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelpler.js";
import Jwt from "jsonwebtoken";
import OTP from "../models/otpModel.js";
import { sendEmail } from "../helpers/emailHelper.js";
import { generateOTP } from "../helpers/otpHelper.js";
import cloudinary from "cloudinary";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const { image } = req.files;

    if (!name || !email || !password || !phone || !image) {
      return res.status(400).send({
        message: "All fields are required",
      });
    }

    // checking for existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ success: false, message: "Email is already registered!" });
    }

    const hashedPassword = await hashPassword(password);

    const CloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath
    );

    if (!CloudinaryResponse) {
      console.error(
        "Cloudinary error : ",
        CloudinaryResponse.error || "unknown cloudinary error!"
      );
    }

    const user = new userModel({
      name,
      email,
      phone,
      image: {
        public_id: CloudinaryResponse.public_id,
        url: CloudinaryResponse.secure_url,
      },
      password: hashedPassword,
    });

    await user.save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Registering user!",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).send({
        message: "Email not found!",
      });
    }

    const matchPassword = await comparePassword(password, user.password);
    if (!matchPassword) {
      return res.status(400).send({
        message: "Invalid Password",
      });
    }

    const otp = generateOTP();
    await new OTP({
      email,
      otp,
    }).save();

    await sendEmail(email, "Your OTP Code", `Your OTP code is ${otp}`);
    res.status(200).send({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while login",
    });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(500).send({
        message: "Fields are required",
      });
    }

    const record = await OTP.findOne({ email, otp });
    if (!record) {
      return res.status(400).send({
        message: "Invalid OTP!",
      });
    }

    const user = await userModel.findOne({ email });
    const token = Jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    await OTP.deleteOne({ email, otp });

    res.status(200).send({
      success: true,
      message: "Login Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "OTP verification error",
    });
  }
};

export const editProfileController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, password } = req.body;
    const { image } = req.files || {};

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    if (email && email !== user.email) {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .send({ message: "Email is already registered!" });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (password) {
      user.password = await hashPassword(password);
    }

    if (image) {
      const CloudinaryResponse = await cloudinary.uploader.upload(
        image.tempFilePath
      );
      if (!CloudinaryResponse) {
        return res.status(500).send({
          success: false,
          message: "Cloudinary upload error",
        });
      }
      user.image = {
        public_id: CloudinaryResponse.public_id,
        url: CloudinaryResponse.secure_url,
      };
    }

    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile updated successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating profile!",
    });
  }
};

export const requestPasswordResetController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        message: "Email is required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).send({
        message: "Email not found!",
      });
    }

    const otp = generateOTP();
    await new OTP({
      email,
      otp,
    }).save();

    await sendEmail(
      email,
      "Your Password Reset OTP Code",
      `Your OTP code is ${otp}`
    );
    res.status(200).send({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while requesting password reset",
    });
  }
};

export const verifyOtpAndResetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).send({
        message: "All fields are required",
      });
    }

    const record = await OTP.findOne({ email, otp });
    if (!record) {
      return res.status(400).send({
        message: "Invalid OTP!",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    const user = await userModel.findOne({ email });
    user.password = hashedPassword;
    await user.save();

    await OTP.deleteOne({ email, otp });

    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while resetting password",
    });
  }
};
