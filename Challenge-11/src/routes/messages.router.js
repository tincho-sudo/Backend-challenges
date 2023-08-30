const express = require("express");
const router = express.Router();
const {
  getAllMessages,
  newMessage,
  deleteMessageById,
  getMessageById,
} = require("../controllers/messages.controller.js");

router.post("/", newMessage);

router.get("/", getAllMessages, () => {
  console.log("c");
});

router.delete("/:mid", deleteMessageById);

router.get("/:mid", getMessageById);

module.exports = { router };
