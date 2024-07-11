import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import connectDb from "./config/dbconnect.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();

//middlewares

app.use(cors({
  origin:["https://social-book-mern-stack-frontend.vercel.app"],
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

connectDb();

//routes

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("hello osam");
});

const port = process.env.PORT;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
