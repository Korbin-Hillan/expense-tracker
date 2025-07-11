import express, { Request, Response, NextFunction } from "express";
import errorHandler from "./middlewares/errorMiddleware";
import { collections } from "./database/connectToDatabase";
import * as dotenv from "dotenv";
import {
  connectToDatabase,
  closeDatabaseConnection,
} from "./database/connectToDatabase";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoute from "./routes/expenseRoute";

const sampleUser = {
  email: "johndoe@example.com",
  name: "John Doe",
  password: "123456",
  createdAt: new Date(),
  updatedAt: new Date(),
};

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/expense", expenseRoute);
app.use("/api/user", userRoutes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      message: "Welcome to the Google OAuth 2.0 + JWT Node.js app!",
      status: "healthy",
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await closeDatabaseConnection();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await closeDatabaseConnection();
  process.exit(0);
});

process.on("close", () => {
  console.error("MongoDB connection closed unexpectedly.");
});

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
