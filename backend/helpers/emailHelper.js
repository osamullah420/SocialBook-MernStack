import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD, // App Password generated for nodemailer
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL, // Sender address (must be your Gmail address)
      to: email, // Recipient's email address
      subject: subject, // Subject line
      text: text, // Plain text body
    });

    console.log("Email sent Successfully");
  } catch (error) {
    console.error("Email not Sent");
    console.error(error);
    throw error; // Ensure to propagate the error so it can be handled in the calling function
  }
};
