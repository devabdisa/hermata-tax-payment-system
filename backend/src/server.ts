import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { prisma } from "./config/db";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Check database connection
    await prisma.$connect();
    console.log("Connected to database successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
