const { StreamChat } = require('stream-chat');
const User = require('../models/User'); 

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

exports.generateToken = async (req, res) => {
  try {
    const { userId } = req.user; 

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID not found' });
    }

    const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
    
    const userInDb = await User.findById(userId);
    if (!userInDb) {
      return res.status(404).json({ error: 'User not found in your database' });
    }

    const streamUser = {
      id: userId.toString(),
      name: userInDb.name,
      image: userInDb.avatar,
    };
    
    await serverClient.upsertUser(streamUser);

    const token = serverClient.createToken(userId.toString());

    res.status(200).json({
      token,
      apiKey: STREAM_API_KEY,
      userId: userId.toString(),
    });

  } catch (error) {
    console.error('Error generating Stream token:', error);
    res.status(500).json({ error: 'Failed to generate Stream token' });
  }
};


