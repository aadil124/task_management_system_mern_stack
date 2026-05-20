import bcrypt from "bcryptjs";
import { connection, collections } from "../../config/db.js";

export const signup = async (req, resp) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return resp.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return resp.status(400).send({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const db = await connection();
    const usersCollection = db.collection(collections.USERS);

    const existingUser = await usersCollection.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return resp.status(409).send({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      avatar: "",
      bio: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(user);

    return resp.status(201).send({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log("SIGNUP ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Signup failed",
    });
  }
};
