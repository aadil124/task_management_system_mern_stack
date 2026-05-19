import { ObjectId } from "mongodb";

import { connection, collections } from "../../config/db.js";

export const getProfile = async (req, resp) => {
  try {
    const db = await connection();
    const usersCollection = db.collection(collections.USERS);

    const user = await usersCollection.findOne(
      {
        _id: new ObjectId(req.user.id),
      },
      {
        projection: {
          password: 0,
        },
      },
    );

    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return resp.status(200).send({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("GET PROFILE ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const updateProfile = async (req, resp) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return resp.status(400).send({
        success: false,
        message: "Name is required",
      });
    }

    const db = await connection();
    const usersCollection = db.collection(collections.USERS);

    const existingUser = await usersCollection.findOne({
      _id: new ObjectId(req.user.id),
    });

    if (!existingUser) {
      return resp.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const updateData = {
      name: name.trim(),
      updatedAt: new Date(),
    };

    // avatar uploaded via Cloudinary
    if (req.file?.path) {
      updateData.avatar = req.file.path;
    }

    await usersCollection.updateOne(
      {
        _id: new ObjectId(req.user.id),
      },
      {
        $set: updateData,
      },
    );

    const updatedUser = await usersCollection.findOne(
      {
        _id: new ObjectId(req.user.id),
      },
      {
        projection: {
          password: 0,
        },
      },
    );

    return resp.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar || "",
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Failed to update profile",
    });
  }
};
