const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error(`MongoDb connection Failed with error : ${error}`);
    }
}

module.exports = connectDB;

