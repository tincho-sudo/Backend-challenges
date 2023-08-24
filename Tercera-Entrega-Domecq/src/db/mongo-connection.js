const mongoose = require("mongoose");
const { DB_USER, DB_PASSWORD, DB_CLUSTER } = require("../config/env");
const dbURI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}`;
class MongoSingleton {
  static #instance;

  constructor() {
    mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  static getInstance() {
    if (this.#instance) {
      console.log("Already connected");
      return this.#instance;
    }
    this.#instance = new MongoSingleton();
    console.log("Connected");
    return this.#instance;
  }

  static getURI() {
    return dbURI;
  }
}

module.exports = { MongoSingleton };
