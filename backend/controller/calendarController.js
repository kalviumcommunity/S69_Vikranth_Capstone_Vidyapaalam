// controllers/calendarController.js
const { google } = require('googleapis');
const User = require('../models/User'); 

const GOOGLE_CALENDAR_CLIENT = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALENDAR_REDIRECT_URI 
);

const calendarScopes = [
  'https://www.googleapis.com/auth/calendar.events.readonly', 
  'https://www.googleapis.com/auth/calendar.readonly',       
];


exports.googleCalendarAuthUrl = (req, res) => {
    console.log("calendarController.googleCalendarAuthUrl: Entered function.");
    console.log("calendarController.googleCalendarAuthUrl: req.user at start:", req.user); 
    console.log("calendarController.googleCalendarAuthUrl: req.user.id at start:", req.user ? req.user.id : "N/A");
    console.log("calendarController.googleCalendarAuthUrl: req.user._id at start (if any):", req.user ? req.user._id : "N/A"); // Check for _id too, just in case

  if (!req.user || !req.user.id) { 
    console.log("calendarController.googleCalendarAuthUrl: req.user is NOT present or req.user.id is missing. Sending 401.");
    return res.status(401).json({ message: 'Authentication required to connect calendar.' });
  }
    console.log("calendarController.googleCalendarAuthUrl: req.user.id is present. Proceeding to generate auth URL.");


  const authUrl = GOOGLE_CALENDAR_CLIENT.generateAuthUrl({
    access_type: 'offline', 
    scope: calendarScopes.join(' '), 
    prompt: 'consent', 
    state: req.user.id.toString(), 
  });

  res.json({ authUrl });
    console.log("calendarController.googleCalendarAuthUrl: Sent auth URL to frontend.");
};


exports.googleCalendarAuthCallback = async (req, res) => {
  const { code, state: userId, error } = req.query; 

  if (error) {
    console.error("Google Calendar Auth Callback Error:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/onboarding?calendarAuthStatus=failed&error=${encodeURIComponent(error)}`);
  }

  if (!code || !userId) {
    console.error("Missing code or state (userId) in Google Calendar OAuth callback.");
    return res.redirect(`${process.env.FRONTEND_URL}/onboarding?calendarAuthStatus=failed&error=${encodeURIComponent('Missing authentication parameters.')}`);
  }

  try {
    const { tokens } = await GOOGLE_CALENDAR_CLIENT.getToken(code);

    const user = await User.findById(userId);

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/onboarding?calendarAuthStatus=failed&error=${encodeURIComponent('User not found during calendar callback.')}`);
    }

    user.googleCalendar.accessToken = tokens.access_token;
    user.googleCalendar.accessTokenExpiryDate = new Date(tokens.expiry_date);
    if (tokens.refresh_token) {
      user.googleCalendar.refreshToken = tokens.refresh_token; // Save only if provided (first time access_type: offline)
    }
    user.googleCalendar.connected = true;
    user.googleCalendar.lastConnected = new Date();

    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/onboarding?calendarAuthStatus=success`);

  } catch (err) {
    console.error("Error exchanging Google code for tokens or saving to DB:", err);
    if (err.code === 400 && err.message.includes('invalid_grant')) {
      const user = await User.findById(userId); 
      if (user) {
        user.googleCalendar.connected = false;
        user.googleCalendar.refreshToken = null;
        user.googleCalendar.accessToken = null;
        user.googleCalendar.accessTokenExpiryDate = null;
        await user.save();
      }
      return res.redirect(`${process.env.FRONTEND_URL}/onboarding?calendarAuthStatus=failed&error=${encodeURIComponent('Google Calendar connection expired. Please reconnect.')}`);
    }
    const errorMessage = err.message || "Failed to connect Google Calendar.";
    res.redirect(`${process.env.FRONTEND_URL}/onboarding?calendarAuthStatus=failed&error=${encodeURIComponent(errorMessage)}`);
  }
};


exports.getGoogleCalendarBusyTimes = async (req, res) => {
  const { date } = req.query; 
  const userId = req.user.id; 

  if (!date) {
    return res.status(400).json({ message: "Date parameter is required (YYYY-MM-DD)." });
  }

  try {
    const user = await User.findById(userId).select('+googleCalendar.refreshToken +googleCalendar.accessToken +googleCalendar.accessTokenExpiryDate');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can fetch calendar availability.' });
    }
    if (!user.googleCalendar || !user.googleCalendar.connected || !user.googleCalendar.refreshToken) {
      return res.status(400).json({ message: 'Google Calendar not connected for this user. Please connect your calendar.' });
    }

    const userOAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALENDAR_REDIRECT_URI
    );

    userOAuth2Client.setCredentials({
      access_token: user.googleCalendar.accessToken,
      refresh_token: user.googleCalendar.refreshToken,
      expiry_date: user.googleCalendar.accessTokenExpiryDate?.getTime(),
    });

    const FIVE_MINUTES = 5 * 60 * 1000;
    const isAccessTokenExpired = !user.googleCalendar.accessToken ||
                                 !user.googleCalendar.accessTokenExpiryDate ||
                                 (new Date().getTime() + FIVE_MINUTES) >= user.googleCalendar.accessTokenExpiryDate.getTime();

    if (isAccessTokenExpired && user.googleCalendar.refreshToken) {
      console.log(`Access token expired for user ${userId}. Attempting to refresh.`);
      const { credentials } = await userOAuth2Client.refreshAccessToken();

      user.googleCalendar.accessToken = credentials.access_token;
      user.googleCalendar.accessTokenExpiryDate = new Date(credentials.expiry_date);
      if (credentials.refresh_token) {
        user.googleCalendar.refreshToken = credentials.refresh_token;
      }
      await user.save();
      userOAuth2Client.setCredentials(credentials); // Use new tokens
    } else if (isAccessTokenExpired && !user.googleCalendar.refreshToken) {

      console.error(`Access token expired and no refresh token for user ${userId}. Requires re-authentication.`);
      user.googleCalendar.connected = false;
      user.googleCalendar.refreshToken = null;
      user.googleCalendar.accessToken = null;
      user.googleCalendar.accessTokenExpiryDate = null;
      await user.save();
      return res.status(401).json({ message: "Google Calendar token expired. Please reconnect your calendar.", needsReauth: true });
    }

    const calendar = google.calendar({ version: 'v3', auth: userOAuth2Client });

    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Please use THAT-MM-DD." });
    }

    const startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(selectedDate.setUTCHours(23, 59, 59, 999)).toISOString();

    const busyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin: startOfDay,
        timeMax: endOfDay,
        items: [{ id: 'primary' }], 
      },
    });

    const busyTimes = busyResponse.data.calendars.primary.busy || [];

    res.status(200).json({
      message: 'Google Calendar busy times fetched successfully.',
      busyTimes: busyTimes, 
    });

  } catch (error) {
    console.error('Error fetching Google Calendar busy times:', error.message);

    if (error.code === 401 || (error.response && error.response.data && error.response.data.error === 'invalid_grant')) {
      const user = await User.findById(req.user.id);
      if (user) {
        user.googleCalendar.connected = false;
        user.googleCalendar.refreshToken = null;
        user.googleCalendar.accessToken = null;
        user.googleCalendar.accessTokenExpiryDate = null;
        await user.save();
      }
      return res.status(401).json({ message: 'Google Calendar connection expired. Please reconnect.', needsReauth: true });
    }
    res.status(500).json({ message: 'Failed to fetch Google Calendar busy times.', error: error.message });
  }
};