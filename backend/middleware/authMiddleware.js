// src/middleware/authMiddleware.js
const jwt               = require("jsonwebtoken");
const User              = require("../models/User");
const BlacklistedToken  = require("../models/BlackListedToken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Auth failed, no token provided" });
    }

    if (await BlacklistedToken.findOne({ token })) {
      return res.status(401).json({ message: "Auth failed, token invalidated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId).select("activeToken");
    if (!user) {
      return res.status(401).json({ message: "Auth failed, user not found" });
    }
    if (user.activeToken !== token) {
      return res.status(401).json({ message: "Auth failed, token mismatch" });
    }

    req.user = { id: userId };
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Auth failed, token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Auth failed, invalid token" });
    }
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Auth failed, general authentication error" });
  }
};

module.exports = authMiddleware;
