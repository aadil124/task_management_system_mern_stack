import jwt from "jsonwebtoken";

const verifyToken = (req, resp, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return resp.status(401).send({
        success: false,
        message: "Authorization token missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return resp.status(401).send({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return resp.status(401).send({
        success: false,
        message: "Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return resp.status(401).send({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    return resp.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
};

export default verifyToken;
