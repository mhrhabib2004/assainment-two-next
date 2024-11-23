import mongoose from "mongoose";
import app from "./app";
import config from "./config";

const startServer = async () => {
  try {
    // Connecting to MongoDB
    await mongoose.connect(config.database_url as string);
    console.log("✅ Connected to MongoDB");

    // Starting Express Server
    app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
