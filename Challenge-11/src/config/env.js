require("dotenv").config();
const { PORT } = process.env;
module.exports = { ...process.env, PORT };
