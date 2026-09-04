const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  const connection = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

module.exports = connectDB;
