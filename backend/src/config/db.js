import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

export const dbName = "node-project";
export const collectionName = "todo";

export const connection = async () => {
  const conn = await client.connect();
  return conn.db(dbName);
};