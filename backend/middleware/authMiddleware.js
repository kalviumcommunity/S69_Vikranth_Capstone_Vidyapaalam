// const jwt              = require("jsonwebtoken");
// const User             = require("../models/User");
// const BlacklistedToken = require("../models/BlackListedToken");

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.cookies.accessToken;
//     if (!token) {
//       return res.status(401).json({ message: "Auth failed, no token provided" });
//     }

//     // Blacklist check → forbid and STOP if revoked
//     const isBlacklisted = await BlacklistedToken.findOne({ token });
//     if (isBlacklisted) {
//       return res.status(403).json({ message: "Auth failed, token invalidated" });
//     }

//     // Verify signature & expiry
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       if (err.name === "TokenExpiredError") {
//         return res.status(403).json({ message: "Auth failed, token expired" });
//       }
//       return res.status(403).json({ message: "Auth failed, invalid token" });
//     }

//     // Now that decode succeeded, we know decoded.id exists
//     const userId = decoded.id;

//     // Load user and confirm it matches the stored activeToken
//     const user = await User.findById(userId).select("activeToken");
//     if (!user) {
//       return res.status(404).json({ message: "Auth failed, user not found" });
//     }
//     if (user.activeToken !== token) {
//       return res.status(403).json({ message: "Auth failed, token mismatch" });
//     }

//     // All checks passed
//     req.user = { id: userId };
//     next();

//   } catch (error) {
//     console.error("Auth middleware error:", error);
//     return res.status(500).json({ message: "Auth failed, general authentication error" });
//   }
// };

// module.exports = authMiddleware;

// src/middleware/authMiddleware.js (This is the one we finalized in the previous turn)
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Correct path to your User model
const BlacklistedToken = require("../models/BlackListedToken"); // Correct path to your BlacklistedToken model (ensure this filename is correct)

// Middleware to protect routes (authentication)
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // 1. Blacklist check
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(403).json({ message: "Not authorized, token invalidated" });
    }

    // 2. Verify signature & expiry
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Not authorized, token expired" });
      }
      return res.status(403).json({ message: "Not authorized, invalid token" });
    }

    // 3. Load user and confirm it matches the stored activeToken
    // Crucially, select 'activeToken' AND 'role'
    const user = await User.findById(decoded.id).select("activeToken role");

    if (!user) {
      return res.status(404).json({ message: "Not authorized, user not found" });
    }

    if (user.activeToken !== token) {
      return res.status(403).json({ message: "Not authorized, token mismatch or invalidated" });
    }

    // All checks passed. Attach user information to the request object.
    req.user = { id: user._id, role: user.role };
    next();

  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Server error during authentication" });
  }
};

// Middleware to authorize roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Authentication required for role check." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user.role}' is not authorized to access this route.`
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };