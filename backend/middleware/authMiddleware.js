

// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); 
// const BlacklistedToken = require("../models/BlackListedToken"); 

// const protect = async (req, res, next) => {
//   try {
//     const token = req.cookies.accessToken;

//     if (process.env.NODE_ENV !== 'production') {
//       console.log('Protect middleware triggered.');
//       console.log('Request Cookies:', req.cookies); // Conditional Debug log
//       console.log('AccessToken in cookies:', token ? 'Exists' : 'Missing'); // Conditional Debug log
//     }

//     if (!token) {
//       if (process.env.NODE_ENV !== 'production') {
//         console.log('No token found. Sending 401.'); // Conditional Debug log
//       }
//       return res.status(401).json({ message: "Not authorized, no token provided" });
//     }

//     // 1. Blacklist check
//     const isBlacklisted = await BlacklistedToken.findOne({ token });
//     if (isBlacklisted) {
//       if (process.env.NODE_ENV !== 'production') {
//         console.log('Token is blacklisted. Sending 403.'); // Conditional Debug log
//       }
//       return res.status(403).json({ message: "Not authorized, token invalidated" });
//     }

//     // 2. Verify signature & expiry
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//       if (process.env.NODE_ENV !== 'production') {
//         console.log('Token successfully verified.'); // Conditional Debug log
//       }
//     } catch (err) {
//       if (process.env.NODE_ENV !== 'production') {
//         console.log('Token verification failed:', err.name, err.message); // Conditional Debug log
//       }
//       if (err.name === "TokenExpiredError") {
//         return res.status(403).json({ message: "Not authorized, token expired" });
//       }
//       return res.status(403).json({ message: "Not authorized, invalid token" });
//     }

//     const user = await User.findById(decoded.id).select("activeToken role");

//     if (!user) {
//       if (process.env.NODE_ENV !== 'production') {
//         console.log('User not found for decoded ID. Sending 404.'); // Conditional Debug log
//       }
//       return res.status(404).json({ message: "Not authorized, user not found" });
//     }

//     if (user.activeToken !== token) {
//       if (process.env.NODE_ENV !== 'production') {
//         console.log('Token mismatch with user\'s activeToken. Sending 403.'); // Conditional Debug log
//       }
//       return res.status(403).json({ message: "Not authorized, token mismatch or invalidated" });
//     }

//     req.user = { id: user._id, role: user.role || null };
//     if (process.env.NODE_ENV !== 'production') {
//       console.log('User authenticated. Role:', req.user.role); // Conditional Debug log
//     }
//     next();

//   } catch (error) {
//     console.error("Auth middleware error:", error); // Keep console.error for critical failures
//     return res.status(500).json({ message: "Server error during authentication" });
//   }
// };

// const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (process.env.NODE_ENV !== 'production') {
//       console.log('AuthorizeRoles middleware triggered.'); 
//       console.log('Required roles:', roles); 
//       console.log('User role:', req.user ? req.user.role : 'N/A'); 
//     }

//     if (!req.user || !req.user.role) {
//       if (process.env.NODE_ENV !== 'production') {
//         console.log('No user or role found on request for authorization. Sending 401.'); 
//       }
//       return res.status(401).json({ message: "Authentication required for role check." });
//     }

//     if (!roles.includes(req.user.role)) {
//       if (process.env.NODE_ENV !== 'production') {
//         console.log(`User role '${req.user.role}' not authorized for required roles: ${roles.join(', ')}. Sending 403.`); // Conditional Debug log
//       }
//       return res.status(403).json({
//         message: `User role '${req.user.role}' is not authorized to access this route.`
//       });
//     }
//     if (process.env.NODE_ENV !== 'production') {
//       console.log(`User role '${req.user.role}' authorized.`); 
//     }
//     next();
//   };
// };

// module.exports = { protect, authorizeRoles };

// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BlacklistedToken = require("../models/BlackListedToken");

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        // Logs will now always show up in production (Render logs)
        console.log('Protect middleware triggered.');
        console.log('Request Cookies:', req.cookies);
        console.log('AccessToken in cookies:', token ? 'Exists' : 'Missing');

        if (!token) {
            console.log('No token found. Sending 401.');
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        // 1. Blacklist check
        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) {
            console.log('Token is blacklisted. Sending 401.');
            return res.status(401).json({ message: "Not authorized, token invalidated" });
        }

        // 2. Verify signature & expiry
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token successfully verified. Decoded ID:', decoded.id);
        } catch (err) {
            console.log('Token verification failed:', err.name, err.message);
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Not authorized, token expired" });
            }
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }

        // Select activeToken and role, refreshToken is not needed for this middleware's function
        const user = await User.findById(decoded.id).select("activeToken role");

        if (!user) {
            console.log('User not found for decoded ID. Sending 401 (user not found).');
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        // Check if the current accessToken matches the one stored as 'activeToken'
        if (user.activeToken !== token) {
            console.log('Token mismatch with user\'s activeToken. Sending 401 (mismatch).');
            return res.status(401).json({ message: "Not authorized, token mismatch or invalidated" });
        }

        // Attach user info to the request
        req.user = { id: user._id, role: user.role || null };
        console.log('User authenticated. Role:', req.user.role, 'User ID:', req.user.id);
        next();

    } catch (error) {
        console.error("Auth middleware unexpected error:", error);
        return res.status(500).json({ message: "Server error during authentication" });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log('AuthorizeRoles middleware triggered.');
        console.log('Required roles:', roles);
        console.log('User role:', req.user ? req.user.role : 'N/A');

        if (!req.user || !req.user.role) {
            console.log('No user or role found on request for authorization. Sending 401.');
            return res.status(401).json({ message: "Authentication required for role check." });
        }

        if (!roles.includes(req.user.role)) {
            console.log(`User role '${req.user.role}' not authorized for required roles: ${roles.join(', ')}. Sending 403.`);
            return res.status(403).json({
                message: `User role '${req.user.role}' is not authorized to access this route.`
            });
        }
        console.log(`User role '${req.user.role}' authorized.`);
        next();
    };
};

module.exports = { protect, authorizeRoles };