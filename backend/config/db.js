const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.URL);
        console.log("Connection successful");
    } catch (err) {
        console.log("Connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
