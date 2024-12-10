require('dotenv').config();
const mongoose = require('mongoose');
require('colors');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `Connected Database: ${connection.connection.db.databaseName}`
        .underline.cyan
    );

    // Listen for Mongoose connection events
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected'.red);
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB reconnected'.green);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`.red);
    });

    return connection;
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { connectDB };
