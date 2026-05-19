import { ObjectId } from "mongodb";
import crypto from "crypto";
import { connection, collections } from "../../config/db.js";

const sanitizeSubtasks = (subtasks = []) => {
  if (!Array.isArray(subtasks)) return [];

  return subtasks
    .filter((subtask) => subtask?.title?.trim())
    .map((subtask) => ({
      id: subtask.id || crypto.randomUUID(),
      title: subtask.title.trim(),
      completed: Boolean(subtask.completed),
      createdAt: subtask.createdAt || new Date(),
    }));
};

const hasIncompleteSubtasks = (subtasks = []) => {
  return subtasks.some((subtask) => !subtask.completed);
};

// ADD TASK
export const addTask = async (req, resp) => {
  try {
    const {
      title,
      description = "",
      priority = "medium",
      status = "todo",
      dueDate = null,
      tags = [],
      subtasks = [],
    } = req.body;

    if (!title?.trim()) {
      return resp.status(400).send({
        success: false,
        message: "Task title is required",
      });
    }

    const allowedPriority = ["low", "medium", "high"];
    const allowedStatus = ["todo", "inprogress", "completed"];

    if (!allowedPriority.includes(priority)) {
      return resp.status(400).send({
        success: false,
        message: "Invalid priority",
      });
    }

    if (!allowedStatus.includes(status)) {
      return resp.status(400).send({
        success: false,
        message: "Invalid status",
      });
    }

    const sanitizedSubtasks = sanitizeSubtasks(subtasks);

    if (
      status === "completed" &&
      sanitizedSubtasks.length > 0 &&
      hasIncompleteSubtasks(sanitizedSubtasks)
    ) {
      return resp.status(400).send({
        success: false,
        message: "Complete all subtasks before marking task as completed",
      });
    }

    const db = await connection();
    const collection = db.collection(collections.TODOS);

    const task = {
      userId: req.user.id,
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: Array.isArray(tags) ? tags : [],
      subtasks: sanitizedSubtasks,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(task);

    return resp.status(201).send({
      success: true,
      message: "Task created successfully",
      result,
    });
  } catch (error) {
    console.log("ADD TASK ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Failed to create task",
    });
  }
};

// GET TASK LIST
export const getTaskList = async (req, resp) => {
  try {
    const {
      search = "",
      priority = "",
      status = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const db = await connection();
    const collection = db.collection(collections.TODOS);

    const query = {
      userId: req.user.id,
    };

    if (search.trim()) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (priority) {
      query.priority = priority;
    }

    if (status) {
      query.status = status;
    }

    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "dueDate",
      "priority",
      "status",
      "title",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const safeOrder = order === "asc" ? 1 : -1;

    const result = await collection
      .find(query)
      .sort({
        [safeSortBy]: safeOrder,
      })
      .toArray();

    return resp.status(200).send({
      success: true,
      result,
    });
  } catch (error) {
    console.log("GET TASK LIST ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Failed to fetch tasks",
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
      result,
    });
  } catch (error) {
    console.log("GET TASK BY ID ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Failed to fetch task",
    });
  }
};

// UPDATE TASK
export const updateTask = async (req, resp) => {
  try {
    const { id } = req.params;

    const {
      title,
      description = "",
      priority,
      status,
      dueDate,
      tags = [],
      subtasks = [],
    } = req.body;

    if (!ObjectId.isValid(id)) {
      return resp.status(400).send({
        success: false,
        message: "Invalid task ID",
      });
    }

    if (!title?.trim()) {
      return resp.status(400).send({
        success: false,
        message: "Task title is required",
      });
    }

    const allowedPriority = ["low", "medium", "high"];
    const allowedStatus = ["todo", "inprogress", "completed"];

    if (!allowedPriority.includes(priority)) {
      return resp.status(400).send({
        success: false,
        message: "Invalid priority",
      });
    }

    if (!allowedStatus.includes(status)) {
      return resp.status(400).send({
        success: false,
        message: "Invalid status",
      });
    }

    const sanitizedSubtasks = sanitizeSubtasks(subtasks);

    if (
      status === "completed" &&
      sanitizedSubtasks.length > 0 &&
      hasIncompleteSubtasks(sanitizedSubtasks)
    ) {
      return resp.status(400).send({
        success: false,
        message: "Complete all subtasks before marking task as completed",
      });
    }

    const db = await connection();
    const collection = db.collection(collections.TODOS);

    const result = await collection.updateOne(
      {
        _id: new ObjectId(id),
        userId: req.user.id,
      },
      {
        $set: {
          title: title.trim(),
          description: description.trim(),
          priority,
          status,
          dueDate: dueDate ? new Date(dueDate) : null,
          tags: Array.isArray(tags) ? tags : [],
          subtasks: sanitizedSubtasks,
          updatedAt: new Date(),
        },
      },
    );

    if (!result.matchedCount) {
      return resp.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    return resp.status(200).send({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.log("UPDATE TASK ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Failed to update task",
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

    if (!result.deletedCount) {
      return resp.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    return resp.status(200).send({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log("DELETE TASK ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Failed to delete task",
    });
  }
};

// BULK DELETE
export const deleteMultipleTasks = async (req, resp) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || !ids.length) {
      return resp.status(400).send({
        success: false,
        message: "No task IDs provided",
      });
    }

    const validIds = ids.filter((id) => ObjectId.isValid(id));

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
      result,
    });
  } catch (error) {
    console.log("BULK DELETE ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Failed to delete tasks",
    });
  }
};
