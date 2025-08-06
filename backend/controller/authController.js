const User = require('../models/User');
const BlacklistedToken = require('../models/BlackListedToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const admin = require('firebase-admin');

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
        paymentAcknowledged: false, 
    });

    if (user) {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.activeToken = refreshToken;
        await user.save();

        res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE });
        res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                paymentAcknowledged: user.paymentAcknowledged 
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
                isVerified: user.isVerified,
                paymentAcknowledged: user.paymentAcknowledged 
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
            availability: user.availability,
            firebaseUid: user.firebaseUid,
            picture: user.picture,
            paymentAcknowledged: user.paymentAcknowledged 
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

        if (user.activeToken !== refreshTokenCookie) {
            console.warn(`[Refresh Token] Refresh token mismatch for user ${user._id}. Stored activeToken: ${user.activeToken}, Incoming: ${refreshTokenCookie}. Invalidating session.`);

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
        res.status(200).json({ message: 'Role updated successfully', user: { 
            id: user._id, 
            role: user.role,
            paymentAcknowledged: user.paymentAcknowledged // ADDED THIS LINE
        }});

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
        if (req.body.picture !== undefined) user.picture = req.body.picture;

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
                firebaseUid: user.firebaseUid,
                picture: user.picture,
                paymentAcknowledged: user.paymentAcknowledged 
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
                isVerified: user.isVerified,
                paymentAcknowledged: user.paymentAcknowledged // ADDED THIS LINE
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
                isVerified: user.isVerified,
                paymentAcknowledged: user.paymentAcknowledged // ADDED THIS LINE
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

        let updatedUserAvailability = [];

        for (const item of availabilityData) {
            const { date, slots } = item;

            if (!date || !Array.isArray(slots)) {
                console.warn(`Skipping malformed availability item received: ${JSON.stringify(item)}`);
                continue;
            }

            const inputDate = new Date(date);
            if (isNaN(inputDate.getTime())) {
                console.warn(`Skipping availability item with invalid date: ${date}`);
                continue;
            }
            inputDate.setUTCHours(0, 0, 0, 0);

            let existingEntryIndex = updatedUserAvailability.findIndex(a => {
                const storedDate = new Date(a.date);
                storedDate.setUTCHours(0, 0, 0, 0);
                return storedDate.getTime() === inputDate.getTime();
            });

            if (existingEntryIndex !== -1) {
                updatedUserAvailability[existingEntryIndex].slots = slots;
            } else {
                updatedUserAvailability.push({ date: inputDate, slots: slots });
            }
        }

        user.availability = updatedUserAvailability;

        await user.save();

        res.status(200).json({
            message: 'Availability updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                availability: user.availability,
                isVerified: user.isVerified,
                paymentAcknowledged: user.paymentAcknowledged // ADDED THIS LINE
            }
        });

    } catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.firebaseAuth = async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ message: 'Firebase ID token is missing.' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const firebaseUid = decodedToken.uid;
        const email = decodedToken.email;
        const name = decodedToken.name || decodedToken.email.split('@')[0];
        const picture = decodedToken.picture || null;

        let user = await User.findOne({ firebaseUid });

        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                user.firebaseUid = firebaseUid;
                user.name = name;
                user.picture = picture;
                await user.save();
                console.log(`Existing user (${user.email}) successfully linked with Firebase UID.`);
            } else {
                user = new User({
                    firebaseUid,
                    email,
                    name,
                    picture,
                    isVerified: true,
                    role: null,
                    password: '',
                    paymentAcknowledged: false, // Ensure this is set for new users created via Firebase too
                });
                await user.save();
                console.log(`New user created in MongoDB via Firebase: ${user.email}`);
            }
        } else {
            if (user.name !== name || user.picture !== picture) {
                user.name = name;
                user.picture = picture;
                await user.save();
                console.log(`User (${user.email}) data updated in MongoDB.`);
            } else {
                console.log(`User (${user.email}) already exists in MongoDB.`);
            }
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.activeToken = refreshToken;
        await user.save();

        res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_AGE });
        res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_AGE });

        res.status(200).json({
            message: 'Authentication successful with Firebase Google.',
            user: {
                id: user._id,
                firebaseUid: user.firebaseUid,
                email: user.email,
                name: user.name,
                picture: user.picture,
                role: user.role,
                isVerified: user.isVerified,
                paymentAcknowledged: user.paymentAcknowledged // ADDED THIS LINE
            }
        });

    } catch (error) {
        console.error('Error during Firebase ID token verification or user processing:', error);
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ message: 'Authentication token has expired. Please sign in again.' });
        }
        res.status(401).json({ message: 'Authentication failed. Invalid token or internal error.', error: error.message });
    }
};
