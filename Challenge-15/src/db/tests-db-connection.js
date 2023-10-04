const mongoose = require("mongoose");
const { DB_USER, DB_PASSWORD, DB_CLUSTER } = require("../config/env");
const dbURI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}`;

const connectToDatabase = async () => {
  await mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const disconnectFromDatabase = async () => {
  await mongoose.disconnect();
};

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
};