const express = require("express");
const router = express.Router();
const {
  getAllLogs,
  newLog,
} = require("../controllers/logs.controller.js");

router.post("/", newLog);

router.get("/", getAllLogs);

module.exports = { router };
