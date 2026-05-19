import { connection, collections } from "../../config/db.js";

// TASK STATS (existing dashboard cards support)
export const getTaskStats = async (req, resp) => {
  try {
    const db = await connection();
    const collection = db.collection(collections.TODOS);

    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, completed, inprogress, todo, overdue] = await Promise.all([
      collection.countDocuments({
        userId,
      }),

      collection.countDocuments({
        userId,
        status: "completed",
      }),

      collection.countDocuments({
        userId,
        status: "inprogress",
      }),

      collection.countDocuments({
        userId,
        status: "todo",
      }),

      collection.countDocuments({
        userId,
        status: {
          $ne: "completed",
        },
        dueDate: {
          $lt: today,
        },
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
    console.log("TASK STATS ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Failed to fetch task stats",
    });
  }
};

// FULL ANALYTICS DASHBOARD
export const getAnalytics = async (req, resp) => {
  try {
    const db = await connection();
    const collection = db.collection(collections.TODOS);

    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // SUMMARY COUNTS
    const [total, completed, inprogress, todo, overdue] = await Promise.all([
      collection.countDocuments({
        userId,
      }),

      collection.countDocuments({
        userId,
        status: "completed",
      }),

      collection.countDocuments({
        userId,
        status: "inprogress",
      }),

      collection.countDocuments({
        userId,
        status: "todo",
      }),

      collection.countDocuments({
        userId,
        status: {
          $ne: "completed",
        },
        dueDate: {
          $lt: today,
        },
      }),
    ]);

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    // STATUS CHART
    const statusChart = [
      {
        name: "Todo",
        value: todo,
      },
      {
        name: "In Progress",
        value: inprogress,
      },
      {
        name: "Completed",
        value: completed,
      },
    ];

    // PRIORITY AGGREGATION
    const priorityAgg = await collection
      .aggregate([
        {
          $match: {
            userId,
          },
        },
        {
          $group: {
            _id: "$priority",
            count: {
              $sum: 1,
            },
          },
        },
      ])
      .toArray();

    const priorityMap = {
      low: 0,
      medium: 0,
      high: 0,
    };

    priorityAgg.forEach((item) => {
      if (item._id && priorityMap[item._id] !== undefined) {
        priorityMap[item._id] = item.count;
      }
    });

    const priorityChart = [
      {
        name: "Low",
        value: priorityMap.low,
      },
      {
        name: "Medium",
        value: priorityMap.medium,
      },
      {
        name: "High",
        value: priorityMap.high,
      },
    ];

    // WEEKLY PRODUCTIVITY
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyAgg = await collection
      .aggregate([
        {
          $match: {
            userId,
            createdAt: {
              $gte: sevenDaysAgo,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
      ])
      .toArray();

    const weeklyMap = {};

    weeklyAgg.forEach((item) => {
      weeklyMap[item._id] = item.count;
    });

    const weeklyChart = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const key = date.toISOString().split("T")[0];

      weeklyChart.push({
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        tasks: weeklyMap[key] || 0,
      });
    }

    return resp.status(200).send({
      success: true,
      analytics: {
        summary: {
          total,
          completed,
          inprogress,
          todo,
          overdue,
          completionRate,
        },
        statusChart,
        priorityChart,
        weeklyChart,
      },
    });
  } catch (error) {
    console.log("ANALYTICS ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};
