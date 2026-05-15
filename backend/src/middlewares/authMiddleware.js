import jwt from "jsonwebtoken";

const verifyToken = (req, resp, next) => {
  try {
    // token comes from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return resp.status(401).send({ message: "Access denied. No token provided.", success: false });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();             // move to the actual route handler

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return resp.status(401).send({ message: "Token expired. Please log in again.", success: false });
    }
    return resp.status(401).send({ message: "Invalid token.", success: false });
  }
};

export default verifyToken;