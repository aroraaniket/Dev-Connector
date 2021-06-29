const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const connectDB = async function () {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('mongoose connected...');
  } catch (err) {
    console.error(err.message);
    //exit process if mongodb not connect
    process.exit(1);
  }
};
module.exports = connectDB;
