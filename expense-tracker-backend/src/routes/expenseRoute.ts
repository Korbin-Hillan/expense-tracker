import express from "express";
import { collections } from "../database/connectToDatabase";
import { verifyToken, AuthenticatedRequest } from "../middlewares/auth";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  const { description, amount, category, date } = req.body;

  if (!description || !amount || !category || !date) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  const newExpense = {
    userId: new ObjectId(user.id),
    description,
    amount,
    category,
    date: new Date(date), // fixed property name to lowercase "date"
    createdAt: new Date(),
  };

  try {
    const result = await collections.expense?.insertOne(newExpense);
    res.status(201).json({ message: "Expense added", id: result?.insertedId });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ message: "Failed to add expense." });
  }
});

router.get("/", verifyToken, async (req, res) => {
  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  try {
    const expenses = await collections.expense
      ?.find({ userId: new ObjectId(user.id) })
      .sort({ date: -1 })
      .toArray();

    res.status(200).json(expenses);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch expenses." });
  }
});

export default router;
