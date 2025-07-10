import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { collections } from "../database/connectToDatabase";
import { UserAttributes, NewUserInput } from "../database/models/User";

const router = express.Router();

router.post("/register", async (req: Request, res: Response): Promise<any> => {
  const { email, name, password }: NewUserInput = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await collections.users?.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: UserAttributes = {
      email,
      name,
      hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collections.users?.insertOne(newUser);

    return res.status(201).json({
      message: "User registered",
      id: result?.insertedId,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<any> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await collections.users?.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secret, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      token,
      name: user.name,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
