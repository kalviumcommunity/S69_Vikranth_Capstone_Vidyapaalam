const jwt               = require("jsonwebtoken");
const BlacklistedToken  = require("../models/BlackListedToken");

const authMiddleware = async (req, res, next) => {
  try {
    console.log("Incoming request to protected route"); // Log every middleware call

    // 1) Grab the token from the cookie
    const token = req.cookies.accessToken;
    console.log("Token from cookies:", token); // Log the token
    if (!token) {
      console.warn("No token found in cookies");
      return res.status(401).json({ message: "Auth failed, no token" });
    }

    // 2) Check if it’s been blacklisted
    const blacklisted = await BlacklistedToken.findOne({ token });
    console.log("Token blacklisted status:", blacklisted); // Log the blacklist check
    if (blacklisted) {
      console.warn("Token is blacklisted");
      return res.status(401).json({ message: "Auth failed, token invalidated" });
    }

    // 3) Verify it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT payload:", decoded); // Log the decoded token data
    req.user = { userId: decoded.id };

    next(); // Proceed to the next middleware or route
  } catch (error) {
    console.error("Error during token verification:", error); // Log any errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Auth failed, token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Auth failed, invalid token" });
    }
    return res.status(401).json({ message: "Auth failed, general authentication error" });
  }
};

module.exports = authMiddleware;
