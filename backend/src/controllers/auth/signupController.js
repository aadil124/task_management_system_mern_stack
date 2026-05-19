import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { connection, collections } from "../../config/db.js";
import { sendEmail } from "../../config/mailer.js";

const createVerificationToken = (userId) => {
  return jwt.sign(
    { id: userId, type: "email-verification" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
};

export const signup = async (req, resp) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim()) {
      return resp.status(400).send({
        success: false,
        message: "Name is required",
      });
    }

    if (!email?.trim()) {
      return resp.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    if (!password || password.length < 6) {
      return resp.status(400).send({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const db = await connection();
    const usersCollection = db.collection(collections.USERS);

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await usersCollection.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return resp.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const tempUser = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: false,
      avatar: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // create user first
    const insertResult = await usersCollection.insertOne(tempUser);

    // create verification token
    const verifyToken = createVerificationToken(
      insertResult.insertedId.toString(),
    );

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: "Verify your email",
        html: `
          <h2>Welcome to TaskFlow</h2>
          <p>Please verify your email to activate your account.</p>
          <a href="${verifyLink}">
            Verify Email
          </a>
        `,
      });
    } catch (mailError) {
      console.log("EMAIL SEND ERROR:", mailError);

      // rollback user if email fails
      await usersCollection.deleteOne({
        _id: insertResult.insertedId,
      });

      return resp.status(500).send({
        success: false,
        message: "Failed to send verification email",
      });
    }

    return resp.status(201).send({
      success: true,
      message: "Account created successfully. Please verify your email.",
    });
  } catch (error) {
    console.log("SIGNUP ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Signup failed",
    });
  }
};

export const verifyEmail = async (req, resp) => {
  try {
    const { token } = req.query;

    if (!token) {
      return resp.status(400).send({
        success: false,
        message: "Verification token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "email-verification") {
      return resp.status(400).send({
        success: false,
        message: "Invalid token type",
      });
    }

    const db = await connection();
    const usersCollection = db.collection(collections.USERS);

    const result = await usersCollection.updateOne(
      {
        _id: new (await import("mongodb")).ObjectId(decoded.id),
      },
      {
        $set: {
          isVerified: true,
          updatedAt: new Date(),
        },
      },
    );

    if (!result.matchedCount) {
      return resp.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return resp.status(200).send({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log("VERIFY EMAIL ERROR:", error);

    return resp.status(400).send({
      success: false,
      message: "Invalid or expired verification link",
    });
  }
};

export const resendVerificationEmail = async (req, resp) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return resp.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const db = await connection();
    const usersCollection = db.collection(collections.USERS);

    const user = await usersCollection.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return resp.status(400).send({
        success: false,
        message: "Email already verified",
      });
    }

    const verifyToken = createVerificationToken(user._id.toString());

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;

    await sendEmail({
      to: normalizedEmail,
      subject: "Verify your email",
      html: `
        <h2>TaskFlow Email Verification</h2>
        <p>Click below to verify your account:</p>
        <a href="${verifyLink}">
          Verify Email
        </a>
      `,
    });

    return resp.status(200).send({
      success: true,
      message: "Verification email sent",
    });
  } catch (error) {
    console.log("RESEND VERIFY EMAIL ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Failed to resend verification email",
    });
  }
};
