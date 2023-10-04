const Message = require("./models/message.model.js");
class MessagesDaoMongo {
  constructor() {}

  getAllMessages = async () => {
    try {
      const message = await Message.find();
      return message;
    } catch (error) {
      throw error;
    }
  };

  newMessage = async (message) => {
    try {
      const newMessage = await Message.create(message);
      return newMessage;
    } catch (error) {
      throw error;
    }
  };
  getMessageById = async (id) => {
    try {
      const message = await Message.findOne(id);
      return message;
    } catch (error) {
      throw error;
    }
  };

  getMessageByQuery = async (query) => {
    try {
      const messages = await Message.find(query);
      return messages;
    } catch (error) {
      throw error;
    }
  };

  deleteMessageById = async (id) => {
    try {
      const deletedMessage = await Message.findByIdAndDelete(id);
      return deletedMessage;
    } catch (error) {
      throw error;
    }
  };

  find = async (query, limit) => {
    try {
      const messages = await Message.find(query).limit(limit);
      return messages;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = MessagesDaoMongo;
