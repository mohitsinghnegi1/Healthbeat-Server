const mongoose = require('mongoose');
// Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node. js. It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.
require('dotenv/config');

const URI = process.env.DB_CONNECTION;
const connectDB = async () => {
  await mongoose
    .connect(URI, {
      dbName: 'Healthbeat',
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('connection with mongodb is established');
    })
    .catch((e) => {
      console.error('error while connecting with mongodb atlas ', e);
    });
};

module.exports = connectDB;
