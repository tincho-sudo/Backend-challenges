const express = require("express");
const Message = require("../dao/models/message.model.js");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user, message } = req.body;
   // console.log(req.body);
    const newMessage = await Message.create({ user, message });
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al crear el mensaje" });
  }
});

router.get("/", async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const { mid, uid } = req.query;
    let messages;

    if (mid) {
      messages = await Message.find({ _id: mid.toString() }).limit(limit);
    } else if (uid) {
      messages = await Message.find({ user: uid.toString() }).limit(limit);
    } else {
      messages = await Message.find().limit(limit);
    }

    if (messages) {
      res.status(200).json({
        success: true,
        messages: messages,
      });
    }
    next();
  } catch (error) {
    //console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los mensajes" });
  }
});

router.delete("/:mid", async (req, res) => {
  try {
    const id = req.params.mid;
    const deletedMessage = await Message.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: deletedMessage });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar el mensaje" });
  }
});

router.get("/", async (req, res) => {});

router.get("/:mid", async (req, res) => {
  try {
    const messageId = req.params.mid;
    const msgFound = await Message.findById(messageId);
    if (msgFound) {
      res.status(200).json({
        success: true,
        message: msgFound,
      });
    } else {
      res.status(404).json({ success: false, error: "Mensaje no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener el Mensaje" });
  }
});

module.exports = router;
