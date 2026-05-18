import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

export const dbName = "node-project";

export const collections = {
  USERS: "users",
  TODOS: "todo",
};

let db = null;

export const connection = async () => {
  if (db) return db;

  await client.connect();
  db = client.db(dbName);

  console.log("MongoDB connected");

  return db;
};
