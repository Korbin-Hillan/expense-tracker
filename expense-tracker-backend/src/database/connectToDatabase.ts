import * as dotenv from "dotenv";
import { MongoClient, ServerApiVersion, Db, Collection } from "mongodb";
import {
  UserAttributes,
  RecurringExpense,
  recurringIncome,
} from "../database/models/User";

dotenv.config();

interface Collections {
  expense?: Collection;
  users?: Collection<UserAttributes>;
  recurringExpense?: Collection<RecurringExpense>;
  income?: Collection;
  recurringIncome?: Collection<recurringIncome>;
}

export const collections: Collections = {};

let client: MongoClient;
let db: Db;

const DB_CONN_STRING = process.env.DB_CONN_STRING;
const DB_NAME = process.env.DB_NAME;

if (!DB_CONN_STRING) {
  throw new Error("DB_CONN_STRING environment variable is required");
}

if (!DB_NAME) {
  throw new Error("DB_NAME environment variable is required");
}

export async function connectToDatabase() {
  try {
    if (client) {
      console.log("Database already connected");
      return;
    }
    client = new MongoClient(DB_CONN_STRING!, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    db = client.db(DB_NAME);

    await db.command({ ping: 1 });

    collections.income = db.collection("incomes");
    collections.recurringIncome = db.collection("recurringIncomes");
    collections.recurringExpense = db.collection("recurringExpenses");
    collections.expense = db.collection("expenses");
    collections.users = db.collection<UserAttributes>("users");

    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  try {
    if (client) {
      await client.close();
      console.log("MongoDB connection closed successfully.");
    } else {
      console.log("No MongoDB connection to close.");
    }
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
  }
}
