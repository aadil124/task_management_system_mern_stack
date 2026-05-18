import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { connection, collections } from "../config/db.js";
import { sendEmail } from "../config/mailer.js";
import { cloudinary } from "../config/cloudinary.js";

// SIGNUP
export const signup = async (req, resp) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
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

    const db = await connection();
    const users = db.collection(collections.USERS);

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return resp.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Welcome ${name}</h2>
        <p>Please verify your email by clicking below:</p>
        <a href="${verifyLink}">Verify Email</a>
      `,
    });

    await users.insertOne({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return resp.send({
      success: true,
      message: "Signup successful. Please verify your email.",
    });
  } catch (error) {
    console.log("Signup error:", error);

    return resp.status(500).send({
      success: false,
      message: "Signup failed",
    });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, resp) => {
  try {
    const token = req.query.token;

    if (!token) {
      return resp.status(400).send({
        success: false,
        message: "Token is required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const db = await connection();
    const users = db.collection(collections.USERS);

    const user = await users.findOne({
      email: decoded.email,
    });

    if (!user) {
      return resp.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return resp.send({
        success: true,
        message: "Email already verified",
      });
    }

    await users.updateOne(
      { email: decoded.email },
      {
        $set: {
          isVerified: true,
          updatedAt: new Date(),
        },
      },
    );

    return resp.send({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log("Verify email error:", error);

    return resp.status(400).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// LOGIN
export const login = async (req, resp) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const db = await connection();
    const users = db.collection(collections.USERS);

    const user = await users.findOne({ email });

    if (!user) {
      return resp.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return resp.status(403).send({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return resp.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return resp.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
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

// FORGOT PASSWORD
export const forgotPassword = async (req, resp) => {
  try {
    const { email } = req.body;

    const db = await connection();
    const users = db.collection(collections.USERS);

    const user = await users.findOne({ email });

    if (!user) {
      return resp.status(200).send({
        success: true,
        message: "If this email exists, a reset link has been sent.",
      });
    }

    const resetToken = jwt.sign(
      {
        id: user._id,
        email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await users.updateOne(
      { email },
      {
        $set: {
          resetToken,
          updatedAt: new Date(),
        },
      },
    );

    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click below to reset password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    return resp.status(200).send({
      success: true,
      message: "If this email exists, a reset link has been sent.",
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, resp) => {
  try {
    const { token, password } = req.body;

    if (!password || password.length < 6) {
      return resp.status(400).send({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const db = await connection();
    const users = db.collection(collections.USERS);

    const user = await users.findOne({
      email: decoded.email,
      resetToken: token,
    });

    if (!user) {
      return resp.status(400).send({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.updateOne(
      { email: decoded.email },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          resetToken: "",
        },
      },
    );

    return resp.send({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);

    return resp.status(400).send({
      success: false,
      message: "Invalid or expired reset token",
    });
  }
};
// GET PROFILE
export const getProfile = async (req, resp) => {
  try {
    const db = await connection();
    const users = db.collection(collections.USERS);

    const user = await users.findOne(
      { _id: new ObjectId(req.user.id) },
      {
        projection: {
          password: 0,
          resetToken: 0,
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
      user,
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, resp) => {
  try {
    const { name, bio } = req.body;

    const db = await connection();
    const users = db.collection(collections.USERS);

    const existingUser = await users.findOne({
      _id: new ObjectId(req.user.id),
    });

    if (!existingUser) {
      return resp.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const updateFields = {
      updatedAt: new Date(),
    };

    if (name?.trim()) {
      updateFields.name = name.trim();
    }

    if (bio !== undefined) {
      updateFields.bio = bio;
    }

    // avatar upload
    if (req.file) {
      try {
        if (existingUser?.avatarPublicId) {
          await cloudinary.uploader.destroy(existingUser.avatarPublicId);
        }
      } catch (err) {
        console.log("Old avatar delete skipped:", err.message);
      }

      updateFields.avatar = req.file.path || "";
      updateFields.avatarPublicId = req.file.filename || "";
    }

    await users.updateOne(
      { _id: new ObjectId(req.user.id) },
      {
        $set: updateFields,
      },
    );

    const updatedUser = await users.findOne(
      { _id: new ObjectId(req.user.id) },
      {
        projection: {
          password: 0,
          resetToken: 0,
        },
      },
    );

    return resp.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("===== PROFILE UPDATE ERROR =====");
    console.dir(error, { depth: null });
    console.log("MESSAGE:", error?.message);
    console.log("STACK:", error?.stack);

    return resp.status(500).send({
      success: false,
      message: "Internal server error",
      error: error?.message,
    });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, resp) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return resp.status(400).send({
        success: false,
        message: "Both passwords are required",
      });
    }

    if (newPassword.length < 6) {
      return resp.status(400).send({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const db = await connection();
    const users = db.collection(collections.USERS);

    const user = await users.findOne({
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

    await users.updateOne(
      { _id: new ObjectId(req.user.id) },
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
    return resp.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// RESEND VERIFICATION EMAIL
export const resendVerificationEmail = async (req, resp) => {
  try {
    const { email } = req.body;

    const db = await connection();
    const users = db.collection(collections.USERS);

    const user = await users.findOne({ email });

    if (!user) {
      return resp.send({
        success: true,
        message: "If account exists, verification email sent",
      });
    }

    if (user.isVerified) {
      return resp.send({
        success: true,
        message: "Email already verified",
      });
    }

    const verifyToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Email Verification</h2>
        <p>Click below to verify your account:</p>
        <a href="${verifyLink}">Verify Email</a>
      `,
    });

    return resp.send({
      success: true,
      message: "Verification email sent",
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Failed to resend verification email",
    });
  }
};
