import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connect to mongodb : ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error while connecting to ${error}`);
  }
};

export default connectDb;
