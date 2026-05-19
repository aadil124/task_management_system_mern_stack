import rateLimit from "express-rate-limit";

// General auth limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});

// Strict login limiter
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
});

// Password reset limiter
export const passwordLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 mins
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many password reset requests. Try later.",
  },
});
