import jwt from "jsonwebtoken";

const verifyToken = (req, resp, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return resp.status(401).send({
        success: false,
        message: "Authentication token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return resp.status(401).send({
        success: false,
        message: "Token expired",
        expired: true,
      });
    }

    return resp.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
};

export default verifyToken;
