const express = require("express");
const router = express.Router();
const {
  getAllMessages,
  newMessage,
  deleteMessageById,
  getMessageById
} = require("../controllers/messages.controller.js");

router.post("/", newMessage);

router.get("/", getAllMessages);

router.delete("/:mid", deleteMessageById);

router.get("/:mid", getMessageById);

module.exports = router;
