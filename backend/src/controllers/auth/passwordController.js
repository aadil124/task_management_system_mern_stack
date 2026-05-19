import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { connection, collections } from "../../config/db.js";
import { sendEmail } from "../../config/mailer.js";

const createResetToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
      type: "password-reset",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
};

// FORGOT PASSWORD
export const forgotPassword = async (req, resp) => {
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

    // Security: don't reveal whether user exists
    if (!user) {
      return resp.status(200).send({
        success: true,
        message: "If this email exists, a password reset link has been sent.",
      });
    }

    const resetToken = createResetToken(user._id.toString());

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: normalizedEmail,
      subject: "Reset your password",
      html: `
        <h2>TaskFlow Password Reset</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">
          Reset Password
        </a>
      `,
    });

    return resp.status(200).send({
      success: true,
      message: "If this email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Failed to process request",
    });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, resp) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return resp.status(400).send({
        success: false,
        message: "Reset token is required",
      });
    }

    if (!password || password.length < 6) {
      return resp.status(400).send({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "password-reset") {
      return resp.status(400).send({
        success: false,
        message: "Invalid reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await connection();
    const usersCollection = db.collection(collections.USERS);

    const result = await usersCollection.updateOne(
      {
        _id: new ObjectId(decoded.id),
      },
      {
        $set: {
          password: hashedPassword,
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
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error);

    if (error.name === "TokenExpiredError") {
      return resp.status(400).send({
        success: false,
        message: "Reset password link has expired.",
        expired: true,
      });
    }

    return resp.status(400).send({
      success: false,
      message: "Invalid reset link",
    });
  }
};

// CHANGE PASSWORD (logged in user)
export const changePassword = async (req, resp) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword) {
      return resp.status(400).send({
        success: false,
        message: "Current password is required",
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return resp.status(400).send({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const db = await connection();
    const usersCollection = db.collection(collections.USERS);

    const user = await usersCollection.findOne({
      _id: new ObjectId(req.user.id),
    });

    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return resp.status(400).send({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await usersCollection.updateOne(
      {
        _id: new ObjectId(req.user.id),
      },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      },
    );

    return resp.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("CHANGE PASSWORD ERROR:", error);

    return resp.status(500).send({
      success: false,
      message: "Failed to change password",
    });
  }
};
