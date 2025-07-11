// const { google } = require('googleapis');
// const User = require('../models/User');
// const BlacklistedToken = require('../models/BlackListedToken');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// const ACCESS_TOKEN_AGE = 15 * 60 * 1000;
// const REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000;

// const cookieOptions = {
//   httpOnly: true,
//   secure: true,
//   sameSite: 'None',
//   path: '/', 
// };

// const generateAccessToken = (user) => {
//   return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
//   });
// };

// const generateRefreshToken = (user) => {
//   return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
//     expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
//   });
// };

// exports.registerUser = async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ message: 'Please enter all fields' });
//   }

//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     return res.status(400).json({ message: 'User already exists' });
//   }

//   const user = await User.create({
//     name,
//     email,
//     password: password,
//     role: null,
//     isGoogleUser: false,
//     googleId: null,
//     isVerified: false,
//     googleCalendar: {
//       connected: false,
//       accessToken: null,
//       refreshToken: null,
//       accessTokenExpiryDate: null,
//       lastConnected: null
//     }
//   });

//   if (user) {
//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE });
//     res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE });

//     res.status(201).json({
//       message: 'User registered successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         isGoogleUser: user.isGoogleUser,
//         googleCalendar: user.googleCalendar,
//         isVerified: user.isVerified
//       }
//     });
//   } else {
//     res.status(400).json({ message: 'Invalid user data' });
//   }
// };

// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email }).select('+password');

//   if (!user) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   if (user.isGoogleUser && !user.password) {
//     return res.status(400).json({ message: 'This account was created with Google. Please use the "Continue with Google" button.' });
//   }

//   if (!user.password || !(await user.matchPassword(password))) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   const accessToken = generateAccessToken(user);
//   const refreshToken = generateRefreshToken(user);

//   res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE });
//   res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE });

//   res.status(200).json({
//     message: 'Logged in successfully',
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       isGoogleUser: user.isGoogleUser,
//       googleCalendar: user.googleCalendar,
//       isVerified: user.isVerified
//     }
//   });
// };

// exports.getMe = async (req, res) => {
//   const user = await User.findById(req.user.id);

//   if (user) {
//     res.status(200).json({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       phoneNumber: user.phoneNumber,
//       bio: user.bio,
//       interestedSkills: user.interestedSkills,
//       teachingSkills: user.teachingSkills,
//       isGoogleUser: user.isGoogleUser,
//       googleCalendar: user.googleCalendar,
//       teacherOnboardingComplete: user.teacherOnboardingComplete,
//       isVerified: user.isVerified
//     });
//   } else {
//     res.status(404).json({ message: 'User not found' });
//   }
// };

// exports.refreshToken = async (req, res) => {
//   const refreshTokenCookie = req.cookies.refreshToken;

//   if (!refreshTokenCookie) {
//     return res.status(401).json({ message: 'No refresh token provided' });
//   }

//   const isBlacklisted = await BlacklistedToken.findOne({ token: refreshTokenCookie });
//   if (isBlacklisted) {
//     console.log('Blacklisted refresh token detected:', refreshTokenCookie);
//     return res.status(401).json({ message: 'Not authorized, token blacklisted' });
//   }

//   try {
//     const decoded = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid refresh token' });
//     }

//     const accessToken = generateAccessToken(user);
//     const newRefreshToken = generateRefreshToken(user);

//     res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE });
//     res.cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE });

//     res.status(200).json({ message: 'Access token refreshed' });
//   } catch (error) {
//     console.error('Refresh token error:', error);
//     res.status(401).json({ message: 'Not authorized, token failed' });
//   }
// };

// exports.logoutUser = async (req, res) => {
//   const refreshTokenCookie = req.cookies.refreshToken;

//   if (refreshTokenCookie) {
//     try {
//       await BlacklistedToken.create({ token: refreshTokenCookie });
//       console.log('Refresh token blacklisted:', refreshTokenCookie);
//     } catch (error) {
//       console.error('Error blacklisting token:', error);
//     }
//   }

//   res.clearCookie('accessToken', { path: '/' });
//   res.clearCookie('refreshToken', { path: '/' });
//   res.status(200).json({ message: 'Logged out successfully' });
// };

// exports.saveRole = async (req, res) => {
//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ message: 'Authentication required.' });
//   }

//   const { role } = req.body;

//   if (!role) {
//     return res.status(400).json({ message: 'Role is required.' });
//   }

//   const allowedRoles = ['student', 'teacher'];
//   if (!allowedRoles.includes(role)) {
//     return res.status(400).json({ message: 'Invalid role provided.' });
//   }

//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     user.role = role;
//     await user.save();
//     res.status(200).json({ message: 'Role updated successfully', user: { id: user._id, role: user.role } });

//   } catch (error) {
//     console.error('Error saving role to database:', error);
//     res.status(500).json({ message: 'Internal Server Error while saving role.' });
//   }
// };

// exports.updateUserProfile = async (req, res) => {
//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ message: 'Authentication required.' });
//   }

//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (req.body.name !== undefined) user.name = req.body.name;
//     if (req.body.phoneNumber !== undefined) user.phoneNumber = req.body.phoneNumber;
//     if (req.body.bio !== undefined) user.bio = req.body.bio;
//     if (req.body.teacherOnboardingComplete !== undefined) user.teacherOnboardingComplete = req.body.teacherOnboardingComplete;
//     if (req.body.isVerified !== undefined) user.isVerified = req.body.isVerified;

//     await user.save();

//     res.status(200).json({
//       message: 'Profile updated successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         phoneNumber: user.phoneNumber,
//         bio: user.bio,
//         interestedSkills: user.interestedSkills,
//         teachingSkills: user.teachingSkills,
//         isGoogleUser: user.isGoogleUser,
//         googleCalendar: user.googleCalendar,
//         teacherOnboardingComplete: user.teacherOnboardingComplete,
//         isVerified: user.isVerified
//       }
//     });

//   } catch (error) {
//     console.error('Error updating profile:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// exports.updateInterestedSkills = async (req, res) => {
//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ message: 'Authentication required.' });
//   }

//   const { interestedSkills } = req.body;

//   if (!Array.isArray(interestedSkills)) {
//     return res.status(400).json({ message: 'Interested skills must be an array.' });
//   }

//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     user.interestedSkills = interestedSkills;
//     await user.save();

//     res.status(200).json({
//       message: 'Interested skills updated successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         interestedSkills: user.interestedSkills,
//         isGoogleUser: user.isGoogleUser,
//         googleCalendar: user.googleCalendar,
//         isVerified: user.isVerified
//       }
//     });

//   } catch (error) {
//     console.error('Error updating interested skills:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// exports.updateTeachingSkills = async (req, res) => {
//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ message: 'Authentication required.' });
//   }

//   const { teachingSkills } = req.body;

//   if (!Array.isArray(teachingSkills)) {
//     return res.status(400).json({ message: 'Teaching skills must be an array.' });
//   }

//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     user.teachingSkills = teachingSkills;
//     await user.save();

//     res.status(200).json({
//       message: 'Teaching skills updated successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         teachingSkills: user.teachingSkills,
//         isGoogleUser: user.isGoogleUser,
//         googleCalendar: user.googleCalendar,
//         isVerified: user.isVerified
//       }
//     });

//   } catch (error) {
//     console.error('Error updating teaching skills:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// exports.updateAvailability = async (req, res) => {
//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ message: 'Authentication required.' });
//   }

//   const { date, slots } = req.body;

//   if (!date || !Array.isArray(slots)) {
//     return res.status(400).json({ message: 'Date and slots array are required.' });
//   }

//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const inputDate = new Date(date);
//     if (isNaN(inputDate.getTime())) {
//       return res.status(400).json({ message: 'Invalid date format provided.' });
//     }
//     inputDate.setUTCHours(0, 0, 0, 0);

//     let existingAvailability = user.availability.find(a => {
//       const storedDate = new Date(a.date);
//       storedDate.setUTCHours(0, 0, 0, 0);
//       return storedDate.getTime() === inputDate.getTime();
//     });

//     if (existingAvailability) {
//       existingAvailability.slots = slots;
//     } else {
//       user.availability.push({ date: inputDate, slots: slots });
//     }

//     await user.save();

//     res.status(200).json({
//       message: 'Availability updated successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         availability: user.availability,
//         isGoogleUser: user.isGoogleUser,
//         googleCalendar: user.googleCalendar,
//         isVerified: user.isVerified
//       }
//     });

//   } catch (error) {
//     console.error('Error updating availability:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// exports.googleAuthUrl = async function (req, res) {
//   const state = crypto.randomUUID(); 

//   res.cookie("oauth_state", state, {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'None',
//     path: '/',
//     maxAge: 5 * 60 * 1000, 
//   });

//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: GOOGLE_SCOPES.join(' '),
//     prompt: 'consent',
//     state, 
//   });

//   return res.redirect(authUrl);
// };


// exports.googleAuthCallback = async function (req, res) {
//   const { code, state } = req.query;
//   const savedState = req.cookies.oauth_state;
//   const frontendBase = process.env.FRONTEND_URL;

//   if (!code || !state || state !== savedState) {
//     res.clearCookie("oauth_state");
//     const errorUrl = `${frontendBase}/signin?error=Invalid or missing state parameter`;
//     return res.redirect(errorUrl);
//   }

//   res.clearCookie("oauth_state");

//   try {
//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);

//     const oauth2 = google.oauth2({ auth: oAuth2Client, version: 'v2' });
//     const { data } = await oauth2.userinfo.get();

//     const googleId = data.id;
//     const email = data.email?.toLowerCase();
//     const name = data.name;

//     let user = await User.findOne({ googleId }) || await User.findOne({ email });
//     let isNewUser = false;

//     if (!user) {
//       if (!email) throw new Error("Email not provided by Google");

//       user = new User({
//         name,
//         email,
//         googleId,
//         isGoogleUser: true,
//         isVerified: true,
//         password: undefined,
//         role: null,
//         googleCalendar: {
//           connected: true,
//           accessToken: tokens.access_token,
//           refreshToken: tokens.refresh_token,
//           accessTokenExpiryDate: new Date(tokens.expiry_date),
//           lastConnected: new Date(),
//         },
//       });

//       isNewUser = true;
//     } else {
//       user.googleId = googleId;
//       user.isGoogleUser = true;
//       user.isVerified = true;
//       if (!user.name && name) user.name = name;
//       if (!user.email && email) user.email = email;

//       user.googleCalendar = {
//         connected: true,
//         accessToken: tokens.access_token,
//         refreshToken: tokens.refresh_token || user.googleCalendar.refreshToken,
//         accessTokenExpiryDate: new Date(tokens.expiry_date),
//         lastConnected: new Date(),
//       };
//     }

//     await user.save();

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE });
//     res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE });

//     let redirectPath = "/onboarding";
//     if (!isNewUser && user.role === "student") {
//       redirectPath = "/student/overview";
//     } else if (!isNewUser && user.role === "teacher") {
//       redirectPath = "/teacher/overview";
//     }

//     return res.redirect(`${frontendBase}${redirectPath}`);
//   } catch (error) {
//     console.error("Google OAuth Callback Error:", error);
//     const errorMessage = encodeURIComponent(error.message || "Google authentication failed");
//     return res.redirect(`${frontendBase}/signin?error=${errorMessage}`);
//   }
// };
  

// exports.disconnectCalendar = async (req, res) => {
//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ message: 'Authentication required.' });
//   }

//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     user.googleCalendar = {
//       connected: false,
//       accessToken: null,
//       refreshToken: null,
//       accessTokenExpiryDate: null,
//       lastConnected: null,
//     };
//     await user.save();

//     res.status(200).json({ message: 'Google Calendar disconnected successfully.' });

//   } catch (error) {
//     console.error('Error disconnecting Google Calendar:', error);
//     res.status(500).json({ message: 'Internal Server Error during calendar disconnect.' });
//   }
// };


const User = require('../models/User');
const BlacklistedToken = require('../models/BlackListedToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: '/',
};

const ACCESS_TOKEN_EXPIRATION = '15m'; // e.g., 15 minutes
const REFRESH_TOKEN_EXPIRATION = '7d';  // e.g., 7 days

const ACCESS_TOKEN_AGE = 15 * 60 * 1000; // 15 minutes in milliseconds
const REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRATION }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRATION }
    );
};

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password: password,
        role: null,
        isVerified: false,
    });

    if (user) {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE });
        res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user || !user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!(await user.matchPassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.activeToken = refreshToken;
        await user.save();

        res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE });
        res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE });

        res.status(200).json({
            message: 'Logged in successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password -activeToken');

    if (user) {
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            bio: user.bio,
            interestedSkills: user.interestedSkills,
            teachingSkills: user.teachingSkills,
            teacherOnboardingComplete: user.teacherOnboardingComplete,
            isVerified: user.isVerified,
            availability: user.availability, // Make sure to include availability if needed on frontend
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.refreshToken = async (req, res) => {
    const refreshTokenCookie = req.cookies.refreshToken;

    if (!refreshTokenCookie) {
        console.log("[Refresh Token] No refresh token cookie found in request.");
        res.clearCookie('accessToken', { ...cookieOptions, maxAge: 0 });
        res.clearCookie('refreshToken', { ...cookieOptions, maxAge: 0 });
        return res.status(401).json({ message: 'No refresh token provided. Please log in.' });
    }

    try {
        const isBlacklisted = await BlacklistedToken.findOne({ token: refreshTokenCookie });
        if (isBlacklisted) {
            console.warn(`[Refresh Token] Blacklisted refresh token detected: ${refreshTokenCookie}. Clearing cookies.`);
            res.clearCookie('accessToken', { ...cookieOptions, maxAge: 0 });
            res.clearCookie('refreshToken', { ...cookieOptions, maxAge: 0 });
            return res.status(401).json({ message: 'Session invalid. Please log in again.' });
        }
    } catch (err) {
        console.error("[Refresh Token] Error checking blacklisted token:", err);
        return res.status(500).json({ message: 'Server error during token validation.' });
    }

    try {
        const decoded = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id).select('+activeToken');

        if (!user) {
            console.warn(`[Refresh Token] User not found for decoded refresh token ID: ${decoded.id}. Clearing cookies.`);
            res.clearCookie('accessToken', { ...cookieOptions, maxAge: 0 });
            res.clearCookie('refreshToken', { ...cookieOptions, maxAge: 0 });
            return res.status(401).json({ message: 'Invalid refresh token (user not found). Please log in again.' });
        }

        // Compare incoming refresh token with the one stored in the user's document
        if (user.activeToken !== refreshTokenCookie) {
            console.warn(`[Refresh Token] Refresh token mismatch for user ${user._id}. Stored activeToken: ${user.activeToken}, Incoming: ${refreshTokenCookie}. Invalidating session.`);

            // Invalidate the stored token to prevent further use of the compromised session
            user.activeToken = null;
            await user.save();

            res.clearCookie('accessToken', { ...cookieOptions, maxAge: 0 });
            res.clearCookie('refreshToken', { ...cookieOptions, maxAge: 0 });
            return res.status(401).json({ message: 'Session compromised or outdated. Please log in again.' });
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Store the new refresh token as the active one
        user.activeToken = newRefreshToken;
        await user.save();

        res.cookie('accessToken', newAccessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE });
        res.cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE });

        console.log(`[Refresh Token] Tokens refreshed successfully for user ${user._id}.`);
        return res.status(200).json({ message: 'Access token refreshed successfully' });

    } catch (error) {
        console.error(`[Refresh Token] JWT verification failed: ${error.name} - ${error.message}. Clearing cookies.`);

        res.clearCookie('accessToken', { ...cookieOptions, maxAge: 0 });
        res.clearCookie('refreshToken', { ...cookieOptions, maxAge: 0 });

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Refresh token expired. Please log in again.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid refresh token. Please log in again.' });
        }
        return res.status(401).json({ message: 'Authentication failed. Please log in again.' });
    }
};

exports.logoutUser = async (req, res) => {
    const refreshTokenCookie = req.cookies.refreshToken;

    if (refreshTokenCookie) {
        try {
            await BlacklistedToken.create({ token: refreshTokenCookie });
            console.log('Refresh token blacklisted:', refreshTokenCookie);
        } catch (error) {
            console.error('Error blacklisting token:', error);
        }
    }

    res.clearCookie('accessToken', { ...cookieOptions, maxAge: 0 });
    res.clearCookie('refreshToken', { ...cookieOptions, maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.saveRole = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    const { role } = req.body;

    if (!role) {
        return res.status(400).json({ message: 'Role is required.' });
    }

    const allowedRoles = ['student', 'teacher'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided.' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.role = role;
        await user.save();
        res.status(200).json({ message: 'Role updated successfully', user: { id: user._id, role: user.role } });

    } catch (error) {
        console.error('Error saving role to database:', error);
        res.status(500).json({ message: 'Internal Server Error while saving role.' });
    }
};

exports.updateUserProfile = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.name !== undefined) user.name = req.body.name;
        if (req.body.phoneNumber !== undefined) user.phoneNumber = req.body.phoneNumber;
        if (req.body.bio !== undefined) user.bio = req.body.bio;
        if (req.body.teacherOnboardingComplete !== undefined) user.teacherOnboardingComplete = req.body.teacherOnboardingComplete;
        if (req.body.isVerified !== undefined) user.isVerified = req.body.isVerified;

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                bio: user.bio,
                interestedSkills: user.interestedSkills,
                teachingSkills: user.teachingSkills,
                teacherOnboardingComplete: user.teacherOnboardingComplete,
                isVerified: user.isVerified,
                availability: user.availability,
            }
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateInterestedSkills = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    const { interestedSkills } = req.body;

    if (!Array.isArray(interestedSkills)) {
        return res.status(400).json({ message: 'Interested skills must be an array.' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.interestedSkills = interestedSkills;
        await user.save();

        res.status(200).json({
            message: 'Interested skills updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                interestedSkills: user.interestedSkills,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error('Error updating interested skills:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateTeachingSkills = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    const { teachingSkills } = req.body;

    if (!Array.isArray(teachingSkills)) {
        return res.status(400).json({ message: 'Teaching skills must be an array.' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.teachingSkills = teachingSkills;
        await user.save();

        res.status(200).json({
            message: 'Teaching skills updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                teachingSkills: user.teachingSkills,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error('Error updating teaching skills:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.updateAvailability = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    const availabilityData = req.body; // Expecting an array of availability objects

    // Validate that the entire body is an array
    if (!Array.isArray(availabilityData)) {
        return res.status(400).json({ message: 'Request body must be an array of availability objects.' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize a new availability array to build up the updated state
        let updatedUserAvailability = [];

        for (const item of availabilityData) {
            const { date, slots } = item;

            // Validate each item in the array
            if (!date || !Array.isArray(slots)) {
                console.warn(`Skipping malformed availability item received: ${JSON.stringify(item)}`);
                continue;
            }

            const inputDate = new Date(date);
            if (isNaN(inputDate.getTime())) {
                console.warn(`Skipping availability item with invalid date: ${date}`);
                continue;
            }
            // Normalize date to start of day UTC for consistent comparison/storage
            inputDate.setUTCHours(0, 0, 0, 0);

            // Add or update the entry in our temporary updatedUserAvailability array
            let existingEntryIndex = updatedUserAvailability.findIndex(a => {
                const storedDate = new Date(a.date);
                storedDate.setUTCHours(0, 0, 0, 0);
                return storedDate.getTime() === inputDate.getTime();
            });

            if (existingEntryIndex !== -1) {
                // If the date already exists in the new data, update its slots
                updatedUserAvailability[existingEntryIndex].slots = slots;
            } else {
                // Otherwise, add the new entry
                updatedUserAvailability.push({ date: inputDate, slots: slots });
            }
        }

        // Assign the newly constructed availability array to the user object
        user.availability = updatedUserAvailability; // This replaces the old availability array

        await user.save();

        res.status(200).json({
            message: 'Availability updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                availability: user.availability, // Send back the updated availability
                isVerified: user.isVerified,
                // Include other relevant fields that the frontend might need to update its context
            }
        });

    } catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
