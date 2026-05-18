import { ObjectId } from "mongodb";
import { connection, collections } from "../config/db.js";

// ADD TASK
export const addTask = async (req, resp) => {
  try {
    const { title, description, priority, status, dueDate, tags } = req.body;

    if (!title) {
      return resp.status(400).send({
        success: false,
        message: "Title is required",
      });
    }

    const db = await connection();
    const collection = db.collection(collections.TODOS);

    const newTask = {
      title,
      description: description || "",
      priority: priority || "medium",
      status: status || "todo",
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: Array.isArray(tags) ? tags : [],
      userId: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newTask);

    return resp.status(201).send({
      success: true,
      message: "Task created successfully",
      result,
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// GET TASK LIST
export const getTaskList = async (req, resp) => {
  try {
    const { search, priority, status, sortBy, order } = req.query;

    const db = await connection();
    const collection = db.collection(collections.TODOS);

    const filter = {
      userId: req.user.id,
    };

    const escapedSearch = search?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    if (escapedSearch) {
      filter.$or = [
        {
          title: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          description: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    if (priority) {
      filter.priority = priority;
    }

    if (status) {
      filter.status = status;
    }

    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "dueDate",
      "priority",
      "status",
      "title",
    ];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const sortOrder = order === "asc" ? 1 : -1;

    const result = await collection
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .toArray();

    return resp.status(200).send({
      success: true,
      message: "Tasks fetched successfully",
      result,
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// GET TASK BY ID
export const getTaskById = async (req, resp) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return resp.status(400).send({
        success: false,
        message: "Invalid task ID",
      });
    }

    const db = await connection();
    const collection = db.collection(collections.TODOS);

    const result = await collection.findOne({
      _id: new ObjectId(id),
      userId: req.user.id,
    });

    if (!result) {
      return resp.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    return resp.status(200).send({
      success: true,
      message: "Task fetched successfully",
      result,
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// UPDATE TASK
export const updateTask = async (req, resp) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return resp.status(400).send({
        success: false,
        message: "Invalid task ID",
      });
    }

    const db = await connection();
    const collection = db.collection(collections.TODOS);

    const { _id, userId, createdAt, ...fields } = req.body;

    if (fields.dueDate) {
      fields.dueDate = new Date(fields.dueDate);
    }

    const result = await collection.updateOne(
      {
        _id: new ObjectId(id),
        userId: req.user.id,
      },
      {
        $set: {
          ...fields,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return resp.status(404).send({
        success: false,
        message: "Task not found or unauthorized",
      });
    }

    return resp.status(200).send({
      success: true,
      message: "Task updated successfully",
      result,
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// DELETE TASK
export const deleteTask = async (req, resp) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return resp.status(400).send({
        success: false,
        message: "Invalid task ID",
      });
    }

    const db = await connection();
    const collection = db.collection(collections.TODOS);

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      userId: req.user.id,
    });

    if (result.deletedCount === 0) {
      return resp.status(404).send({
        success: false,
        message: "Task not found or unauthorized",
      });
    }

    return resp.status(200).send({
      success: true,
      message: "Task deleted successfully",
      result,
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// DELETE MULTIPLE TASKS
export const deleteMultipleTasks = async (req, resp) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return resp.status(400).send({
        success: false,
        message: "No task IDs provided",
      });
    }

    const validIds = ids.filter((id) => ObjectId.isValid(id));

    if (!validIds.length) {
      return resp.status(400).send({
        success: false,
        message: "No valid task IDs",
      });
    }

    const db = await connection();
    const collection = db.collection(collections.TODOS);

    const result = await collection.deleteMany({
      _id: {
        $in: validIds.map((id) => new ObjectId(id)),
      },
      userId: req.user.id,
    });

    return resp.status(200).send({
      success: true,
      message: `${result.deletedCount} task(s) deleted successfully`,
      result,
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// TASK STATS
export const getTaskStats = async (req, resp) => {
  try {
    const db = await connection();
    const collection = db.collection(collections.TODOS);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, completed, inprogress, todo, overdue] = await Promise.all([
      collection.countDocuments({
        userId: req.user.id,
      }),

      collection.countDocuments({
        userId: req.user.id,
        status: "completed",
      }),

      collection.countDocuments({
        userId: req.user.id,
        status: "inprogress",
      }),

      collection.countDocuments({
        userId: req.user.id,
        status: "todo",
      }),

      collection.countDocuments({
        userId: req.user.id,
        status: { $ne: "completed" },
        dueDate: { $lt: today },
      }),
    ]);

    return resp.status(200).send({
      success: true,
      stats: {
        total,
        completed,
        inprogress,
        todo,
        overdue,
      },
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
