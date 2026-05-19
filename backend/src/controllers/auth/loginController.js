import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { connection, collections } from "../../config/db.js";

const createAuthToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

export const login = async (req, resp) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim()) {
      return resp.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return resp.status(400).send({
        success: false,
        message: "Password is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const db = await connection();
    const usersCollection = db.collection(collections.USERS);

    const user = await usersCollection.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return resp.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return resp.status(403).send({
        success: false,
        message: "Please verify your email first",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return resp.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createAuthToken(user);

    return resp.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Login failed",
    });
  }
};
