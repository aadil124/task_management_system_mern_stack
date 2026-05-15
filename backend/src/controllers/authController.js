import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connection } from "../config/db.js";

export const signup = async (req, resp) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return resp.status(400).send({ message: "All fields are required", success: false });
    }

    const db = await connection();
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return resp.status(409).send({ message: "Email already registered", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await users.insertOne({ name, email, password: hashedPassword });

    return resp.status(201).send({ message: "Account created successfully", success: true, result });
  } catch (error) {
    return resp.status(500).send({ message: "Internal server error", success: false, error: error.message });
  }
};

export const login = async (req, resp) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).send({ message: "All fields are required", success: false });
    }

    const db = await connection();
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      return resp.status(401).send({ message: "Invalid email or password", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return resp.status(401).send({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return resp.status(200).send({
      message: "Login successful",
      success: true,
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    return resp.status(500).send({ message: "Internal server error", success: false, error: error.message });
  }
};