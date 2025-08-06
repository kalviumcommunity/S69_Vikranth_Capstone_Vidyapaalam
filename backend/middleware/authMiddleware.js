const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BlacklistedToken = require("../models/BlackListedToken");

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no access token provided" });
        }

        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Not authorized, access token invalidated" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Not authorized, access token expired" });
            }
            return res.status(401).json({ message: "Not authorized, invalid access token" });
        }

        const user = await User.findById(decoded.id).select("role");

        if (!user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        req.user = { id: user._id, role: user.role || null };
        next();

    } catch (error) {
        return res.status(500).json({ message: "Server error during authentication" });
    }
};

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
