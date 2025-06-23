
// const { google } = require('googleapis');
// const User = require('../models/User'); 

// const createOAuth2ClientForUser = (refreshToken) => {
//   const oAuth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_CALENDAR_REDIRECT_URI
//   );
//   oAuth2Client.setCredentials({ refresh_token: refreshToken });
//   return oAuth2Client;
// };

// exports.getGoogleCalendarAvailability = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('+googleCalendar.refreshToken');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }
//     if (user.role !== 'teacher') {
//       return res.status(403).json({ message: 'Only teachers can fetch calendar availability.' });
//     }
//     if (!user.googleCalendar || !user.googleCalendar.connected || !user.googleCalendar.refreshToken) {
//       return res.status(400).json({ message: 'Google Calendar not connected for this user.' });
//     }

//     const calendarOAuth2Client = createOAuth2ClientForUser(user.googleCalendar.refreshToken);
//     const calendar = google.calendar({ version: 'v3', auth: calendarOAuth2Client });

//     const timeMin = new Date(); 
//     const timeMax = new Date();
//     timeMax.setDate(timeMax.getDate() + 7); 

//     const response = await calendar.freebusy.query({
//       requestBody: {
//         timeMin: timeMin.toISOString(),
//         timeMax: timeMax.toISOString(),
//         items: [{ id: 'primary' }], // Check the user's primary calendar
//       },
//     });

//     const busyTimes = response.data.calendars.primary.busy;

//     res.status(200).json({
//       message: 'Google Calendar busy times fetched successfully.',
//       busyTimes: busyTimes,
//     });

//   } catch (error) {
//     console.error('Error fetching Google Calendar availability:', error.message);
//     if (error.code === 401 || (error.response && error.response.data && error.response.data.error === 'invalid_grant')) {
//       const user = await User.findById(req.user.id);
//       if (user) {
//         user.googleCalendar.connected = false;
//         user.googleCalendar.refreshToken = null; 
//         await user.save();
//       }
//       return res.status(401).json({ message: 'Google Calendar connection expired. Please reconnect.', needsReauth: true });
//     }
//     res.status(500).json({ message: 'Failed to fetch Google Calendar availability.', error: error.message });
//   }
// };

// controllers/calendarController.js
const { google } = require('googleapis');
const User = require('../models/User'); 

const GOOGLE_CALENDAR_CLIENT = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALENDAR_REDIRECT_URI 
);

const calendarScopes = [
  'https://www.googleapis.com/auth/calendar.events.readonly', // Read events (for busy times)
  'https://www.googleapis.com/auth/calendar.readonly',       // Read calendar list (to get primary calendar if needed)
];


exports.googleCalendarAuthUrl = (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Authentication required to connect calendar.' });
  }

  const authUrl = GOOGLE_CALENDAR_CLIENT.generateAuthUrl({
    access_type: 'offline', 
    scope: calendarScopes.join(' '), 
    prompt: 'consent', 
    state: req.user._id.toString(), 
  });

  res.json({ authUrl });
};


exports.googleCalendarAuthCallback = async (req, res) => {
  const { code, state: userId, error } = req.query; // 'state' will be the user ID

  if (error) {
    console.error("Google Calendar Auth Callback Error:", error);
    // Redirect to frontend's onboarding page with an error status
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

    // Update user in database with Google Calendar tokens and connection status
    user.googleCalendar.accessToken = tokens.access_token;
    user.googleCalendar.accessTokenExpiryDate = new Date(tokens.expiry_date);
    if (tokens.refresh_token) {
      user.googleCalendar.refreshToken = tokens.refresh_token; // Save only if provided (first time access_type: offline)
    }
    user.googleCalendar.connected = true;
    user.googleCalendar.lastConnected = new Date();

    await user.save();

    // Redirect back to frontend's onboarding page with success status
    res.redirect(`${process.env.FRONTEND_URL}/onboarding?calendarAuthStatus=success`);

  } catch (err) {
    console.error("Error exchanging Google code for tokens or saving to DB:", err);
    // Handle specific Google API errors, e.g., invalid_grant for expired refresh tokens
    if (err.code === 400 && err.message.includes('invalid_grant')) {
      const user = await User.findById(userId); // Fetch user again to clear token status
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
      return res.status(400).json({ message: "Invalid date format. Please use YYYY-MM-DD." });
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