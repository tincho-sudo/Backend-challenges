const MessagesService = require("../services/messages.service");
const messagesService = new MessagesService();

const getAllMessages = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const { mid, uid } = req.query;
    let query = {};
    if (mid) {
      query._id = mid.toString();
    } else if (uid) {
      query.user = uid.toString();
    }

    const messages = await messagesService.findMessages(query).limit(limit);

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
};
const newMessage = async (req, res) => {
  try {
    const { user, message } = req.body;
    // console.log(req.body);
    const newMessage = await messagesService.newMessage({ user, message });
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al crear el mensaje" });
  }
};

const deleteMessageById = async (req, res) => {
  try {
    const id = req.params.mid;
    const deletedMessage = await messagesService.deleteMessageById(id);

    res.status(200).json({ success: true, message: deletedMessage });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar el mensaje" });
  }
};

const getMessageById = async (req, res) => {
  try {
    const messageId = req.params.mid;
    const msgFound = await messagesService.getMessageById(messageId);
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
};

module.exports = {
  getAllMessages,
  newMessage,
  deleteMessageById,
  getMessageById,
};
