import express from "express";
import { collections } from "../database/connectToDatabase";
import { verifyToken, AuthenticatedRequest } from "../middlewares/auth";
import { ObjectId } from "mongodb";

const router = express.Router();

// POST /api/recurring-expense - Create new recurring expense
router.post("/", verifyToken, async (req, res) => {
  const {
    description,
    amount,
    category,
    startDate,
    interval,
    isActive = true,
  } = req.body;

  if (!description || !amount || !category || !startDate || !interval) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  // Validate interval
  const validIntervals = ["Weekly", "Monthly", "Annually"];
  if (!validIntervals.includes(interval)) {
    res.status(400).json({
      message: "Invalid interval. Must be Weekly, Monthly, or Annually.",
    });
    return;
  }

  const newRecurringExpense = {
    userId: new ObjectId(user.id),
    description,
    amount: parseFloat(amount),
    category,
    startDate: new Date(startDate),
    interval,
    isActive: Boolean(isActive),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const result = await collections.recurringExpense?.insertOne(
      newRecurringExpense
    );
    res.status(201).json({
      message: "Recurring expense added",
      id: result?.insertedId,
    });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ message: "Failed to add recurring expense." });
  }
});

// GET /api/recurring-expense - Get all recurring expenses for user
router.get("/", verifyToken, async (req, res) => {
  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  try {
    const recurringExpenses = await collections.recurringExpense
      ?.find({ userId: new ObjectId(user.id) })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(recurringExpenses);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch recurring expenses." });
  }
});

// PUT /api/recurring-expense/:id - Update recurring expense
router.put("/:id", verifyToken, async (req, res) => {
  const recurringExpenseId = req.params.id;

  if (!ObjectId.isValid(recurringExpenseId)) {
    res.status(400).json({ message: "Invalid recurring expense ID" });
    return;
  }

  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  const { description, amount, category, startDate, interval, isActive } =
    req.body;

  // Validate interval if provided
  if (interval) {
    const validIntervals = ["Weekly", "Monthly", "Annually"];
    if (!validIntervals.includes(interval)) {
      res.status(400).json({
        message: "Invalid interval. Must be Weekly, Monthly, or Annually.",
      });
      return;
    }
  }

  const updateFields: any = {
    updatedAt: new Date(),
  };

  // Only update provided fields
  if (description !== undefined) updateFields.description = description;
  if (amount !== undefined) updateFields.amount = parseFloat(amount);
  if (category !== undefined) updateFields.category = category;
  if (startDate !== undefined) updateFields.startDate = new Date(startDate);
  if (interval !== undefined) updateFields.interval = interval;
  if (isActive !== undefined) updateFields.isActive = Boolean(isActive);

  try {
    const result = await collections.recurringExpense?.updateOne(
      {
        _id: new ObjectId(recurringExpenseId),
        userId: new ObjectId(user.id),
      },
      {
        $set: updateFields,
      }
    );

    if (result?.matchedCount === 0) {
      res
        .status(404)
        .json({ message: "Recurring expense not found or not yours." });
      return;
    }

    res
      .status(200)
      .json({ message: "Recurring expense updated successfully." });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update recurring expense." });
  }
});

// PATCH /api/recurring-expense/:id - Toggle active status (or partial update)
router.patch("/:id", verifyToken, async (req, res) => {
  const recurringExpenseId = req.params.id;

  if (!ObjectId.isValid(recurringExpenseId)) {
    res.status(400).json({ message: "Invalid recurring expense ID" });
    return;
  }

  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  const { isActive } = req.body;

  if (isActive === undefined) {
    res.status(400).json({ message: "isActive field is required." });
    return;
  }

  try {
    const result = await collections.recurringExpense?.updateOne(
      {
        _id: new ObjectId(recurringExpenseId),
        userId: new ObjectId(user.id),
      },
      {
        $set: {
          isActive: Boolean(isActive),
          updatedAt: new Date(),
        },
      }
    );

    if (result?.matchedCount === 0) {
      res
        .status(404)
        .json({ message: "Recurring expense not found or not yours." });
      return;
    }

    res.status(200).json({
      message: `Recurring expense ${
        isActive ? "activated" : "deactivated"
      } successfully.`,
    });
  } catch (err) {
    console.error("Patch error:", err);
    res
      .status(500)
      .json({ message: "Failed to update recurring expense status." });
  }
});

// DELETE /api/recurring-expense/:id - Delete recurring expense
router.delete("/:id", verifyToken, async (req, res) => {
  const recurringExpenseId = req.params.id;

  if (!ObjectId.isValid(recurringExpenseId)) {
    res.status(400).json({ message: "Invalid recurring expense ID" });
    return;
  }

  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  try {
    const result = await collections.recurringExpense?.deleteOne({
      _id: new ObjectId(recurringExpenseId),
      userId: new ObjectId(user.id),
    });

    if (result?.deletedCount === 0) {
      res
        .status(404)
        .json({ message: "Recurring expense not found or not yours." });
      return;
    }

    res
      .status(200)
      .json({ message: "Recurring expense deleted successfully." });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete recurring expense." });
  }
});

export default router;
