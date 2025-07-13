import express from "express";
import { collections } from "../database/connectToDatabase";
import { verifyToken, AuthenticatedRequest } from "../middlewares/auth";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  const {
    description,
    amount,
    category,
    isRecurring,
    recurringInterval,
    date,
  } = req.body;

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
    isRecurring,
    recurringInterval,
    date: new Date(date),
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

router.put("/:id", verifyToken, async (req, res) => {
  const expenseId = req.params.id;

  if (!ObjectId.isValid(expenseId)) {
    res.status(400).json({ message: "Invalid expense ID" });
    return;
  }

  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  const {
    description,
    amount,
    category,
    isRecurring,
    recurringInterval,
    date,
  } = req.body;

  try {
    const result = await collections.expense?.updateOne(
      {
        _id: new ObjectId(expenseId),
        userId: new ObjectId(user.id),
      },
      {
        $set: {
          description,
          amount,
          category,
          isRecurring,
          recurringInterval,
          date: new Date(date),
          updatedAt: new Date(),
        },
      }
    );
    if (result?.matchedCount === 0) {
      res.status(404).json({ message: "Expense not found or not yours." });
      return;
    }
    res.status(200).json({ message: "Expense updated successfully." });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update expense." });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const expenseId = req.params.id;

  if (!ObjectId.isValid(expenseId)) {
    res.status(400).json({ message: "Invalid expense ID" });
    return;
  }

  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }
  try {
    const result = await collections.expense?.deleteOne({
      _id: new ObjectId(expenseId),
      userId: new ObjectId(user.id),
    });
    if (result?.deletedCount === 0) {
      res.status(404).json({ message: "Expense not found or not yours." });
      return;
    }
    res.status(200).json({ message: "Expense deleted successfully." });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete expense." });
  }
});

export default router;
