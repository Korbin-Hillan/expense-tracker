import express from "express";
import { collections } from "../database/connectToDatabase";
import { verifyToken, AuthenticatedRequest } from "../middlewares/auth";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  const { description, amount, isRecurring, recurringInterval, date } =
    req.body;

  if (!description || !amount || !date) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  const newIncome = {
    userId: new ObjectId(user.id),
    description,
    amount,
    isRecurring,
    recurringInterval,
    date: new Date(date),
    createdAt: new Date(),
  };

  try {
    const result = await collections.income?.insertOne(newIncome);
    res.status(201).json({ message: "Income added", id: result?.insertedId });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ message: "Failed to add income." });
  }
});

router.get("/", verifyToken, async (req, res) => {
  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  try {
    const incomes = await collections.income
      ?.find({ userId: new ObjectId(user.id) })
      .sort({ date: -1 })
      .toArray();

    res.status(200).json(incomes);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch incomes." });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const incomeId = req.params.id;

  if (!ObjectId.isValid(incomeId)) {
    res.status(400).json({ message: "Invalid income ID" });
    return;
  }

  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  const { description, amount, isRecurring, recurringInterval, date } =
    req.body;

  try {
    const result = await collections.income?.updateOne(
      {
        _id: new ObjectId(incomeId),
        userId: new ObjectId(user.id),
      },
      {
        $set: {
          description,
          amount,
          isRecurring,
          recurringInterval,
          date: new Date(date),
          updatedAt: new Date(),
        },
      }
    );
    if (result?.matchedCount === 0) {
      res.status(404).json({ message: "Income not found or not yours." });
      return;
    }
    res.status(200).json({ message: "Income updated successfully." });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update incomes." });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const incomeId = req.params.id;

  if (!ObjectId.isValid(incomeId)) {
    res.status(400).json({ message: "Invalid income ID" });
    return;
  }

  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }
  try {
    const result = await collections.income?.deleteOne({
      _id: new ObjectId(incomeId),
      userId: new ObjectId(user.id),
    });
    if (result?.deletedCount === 0) {
      res.status(404).json({ message: "Income not found or not yours." });
      return;
    }
    res.status(200).json({ message: "Income deleted successfully." });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete income." });
  }
});

export default router;
