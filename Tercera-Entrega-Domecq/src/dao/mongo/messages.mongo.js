const Message = require("./models/message.model.js");
class MessagesDaoMongo {
  constructor() {}

  getAllMessages = async () => {
    try {
      const message = await Message.find();
      return message;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  newMessage = async (message) => {
    try {
      const newMessage = await Message.create(message);
      return newMessage;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  getMessageById = async (id) => {
    try {
      const message = await Message.findOne(id);
      return message;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getMessageByQuery = async (query) => {
    try {
      const messages = await Message.find(query);
      return messages;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  deleteMessageById = async (id) => {
    try {
      const deletedMessage = await Message.findByIdAndDelete(id);
      return deletedMessage;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  find = async (query, limit) => {
    try {
      const messages = await Message.find(query).limit(limit);
      return messages;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

module.exports = MessagesDaoMongo;
