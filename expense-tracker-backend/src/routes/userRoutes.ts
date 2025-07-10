import express, { Router, Request, Response } from "express";
import { collections } from "../database/connectToDatabase";
import { UserAttributes } from "../database/models/User";

const router = express.Router();

router.get("/name", async (req: Request, res: Response): Promise<any> => {
  const name = req.query.name as string;

  if (!name) {
    return res.status(400).json({ message: "Name is required." });
  }

  try {
    const user = await collections.users?.findOne({ name });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user: { fullName: user.name } });
  } catch (err) {
    console.error("Find user by name error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/", async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.query;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required." });
  }

  try {
    const user = await collections.users?.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res
      .status(200)
      .json({
        user: { fullName: user.name, password: password, email: email },
      });
  } catch (err) {
    console.error("Find user by name error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
