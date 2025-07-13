import express from "express";
import { collections } from "../database/connectToDatabase";
import { verifyToken, AuthenticatedRequest } from "../middlewares/auth";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  const {
    description,
    amount,
    startDate,
    interval,
    isActive = true,
  } = req.body;

  if (!description || !amount || !startDate || !interval) {
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

  const newRecurringIncome = {
    userId: new ObjectId(user.id),
    description,
    amount: parseFloat(amount),
    startDate: new Date(startDate),
    interval,
    isActive: Boolean(isActive),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const result = await collections.recurringIncome?.insertOne(
      newRecurringIncome
    );
    res.status(201).json({
      message: "Recurring income added",
      id: result?.insertedId,
    });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ message: "Failed to add recurring income." });
  }
});

router.get("/", verifyToken, async (req, res) => {
  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  try {
    const recurringIncomes = await collections.recurringIncome
      ?.find({ userId: new ObjectId(user.id) })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(recurringIncomes);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch recurring incomes." });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const recurringIncomeId = req.params.id;

  if (!ObjectId.isValid(recurringIncomeId)) {
    res.status(400).json({ message: "Invalid recurring income ID" });
    return;
  }

  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  const { description, amount, startDate, interval, isActive } = req.body;

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
  if (startDate !== undefined) updateFields.startDate = new Date(startDate);
  if (interval !== undefined) updateFields.interval = interval;
  if (isActive !== undefined) updateFields.isActive = Boolean(isActive);

  try {
    const result = await collections.recurringIncome?.updateOne(
      {
        _id: new ObjectId(recurringIncomeId),
        userId: new ObjectId(user.id),
      },
      {
        $set: updateFields,
      }
    );

    if (result?.matchedCount === 0) {
      res
        .status(404)
        .json({ message: "Recurring income not found or not yours." });
      return;
    }

    res.status(200).json({ message: "Recurring income updated successfully." });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update recurring income." });
  }
});

router.patch("/:id", verifyToken, async (req, res) => {
  const recurringIncomeId = req.params.id;

  if (!ObjectId.isValid(recurringIncomeId)) {
    res.status(400).json({ message: "Invalid recurring income ID" });
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
    const result = await collections.recurringIncome?.updateOne(
      {
        _id: new ObjectId(recurringIncomeId),
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
        .json({ message: "Recurring income not found or not yours." });
      return;
    }

    res.status(200).json({
      message: `Recurring income ${
        isActive ? "activated" : "deactivated"
      } successfully.`,
    });
  } catch (err) {
    console.error("Patch error:", err);
    res
      .status(500)
      .json({ message: "Failed to update recurring income status." });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const recurringIncomeId = req.params.id;

  if (!ObjectId.isValid(recurringIncomeId)) {
    res.status(400).json({ message: "Invalid recurring income ID" });
    return;
  }

  const { user } = req as AuthenticatedRequest;

  if (!user?.id) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  try {
    const result = await collections.recurringIncome?.deleteOne({
      _id: new ObjectId(recurringIncomeId),
      userId: new ObjectId(user.id),
    });

    if (result?.deletedCount === 0) {
      res
        .status(404)
        .json({ message: "Recurring income not found or not yours." });
      return;
    }

    res.status(200).json({ message: "Recurring income deleted successfully." });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete recurring income." });
  }
});

export default router;
