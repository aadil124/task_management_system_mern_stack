import { ObjectId } from "mongodb";
import { connection, collectionName } from "../config/db.js";

export const addTask = async (req, resp) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);
    // attach userId from token so tasks belong to the logged-in user
    const result = await collection.insertOne({ ...req.body, userId: req.user.id });

    if (result.acknowledged) {
      return resp.status(200).send({ message: "New task added", success: true, result });
    }

    return resp.status(400).send({ message: "Task not added", success: false });
  } catch (error) {
    return resp.status(500).send({ message: "Internal server error", success: false, error: error.message });
  }
};

export const getTaskList = async (req, resp) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);
    // only return tasks belonging to the logged-in user
    const result = await collection.find({ userId: req.user.id }).toArray();

    return resp.status(200).send({ message: "Data fetched successfully", success: true, result });
  } catch (error) {
    return resp.status(500).send({ message: "Internal server error", success: false, error: error.message });
  }
};

export const getTaskById = async (req, resp) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.findOne({
      _id: new ObjectId(req.params.id),
      userId: req.user.id, // ensure user can only access their own task
    });

    if (!result) {
      return resp.status(404).send({ message: "Task not found", success: false });
    }

    return resp.status(200).send({ message: "Data fetched successfully", success: true, result });
  } catch (error) {
    return resp.status(500).send({ message: "Internal server error", success: false, error: error.message });
  }
};

export const updateTask = async (req, resp) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);
    const { _id, ...fields } = req.body;

    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id), userId: req.user.id },
      { $set: fields }
    );

    if (result.matchedCount === 0) {
      return resp.status(404).send({ message: "Task not found or unauthorized", success: false });
    }

    return resp.status(200).send({ message: "Data updated successfully", success: true, result });
  } catch (error) {
    return resp.status(500).send({ message: "Internal server error", success: false, error: error.message });
  }
};

export const deleteTask = async (req, resp) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
      userId: req.user.id,
    });

    if (result.deletedCount === 0) {
      return resp.status(404).send({ message: "Task not found or unauthorized", success: false });
    }

    return resp.status(200).send({ message: "Data deleted successfully", success: true, result });
  } catch (error) {
    return resp.status(500).send({ message: "Internal server error", success: false, error: error.message });
  }
};

export const deleteMultipleTasks = async (req, resp) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return resp.status(400).send({ message: "No IDs provided", success: false });
    }

    const db = await connection();
    const collection = db.collection(collectionName);

    const result = await collection.deleteMany({
      _id: { $in: ids.map((id) => new ObjectId(id)) },
      userId: req.user.id, // only delete tasks owned by this user
    });

    return resp.status(200).send({
      message: `${result.deletedCount} task(s) deleted successfully`,
      success: true,
      result,
    });
  } catch (error) {
    return resp.status(500).send({ message: "Internal server error", success: false, error: error.message });
  }
};