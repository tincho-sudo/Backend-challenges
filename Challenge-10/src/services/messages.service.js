const MessagesDao = require("../dao/mongo/messages.mongo.js");

class MessagesService {
  constructor() {
    this.dao = new MessagesDao();
  }

  getAllMessages() {
    return this.dao.getAllMessages();
  }

  newMessage(message) {
    return this.dao.newMessage(message);
  }

  getMessageById(id) {
    return this.dao.getMessageById(id);
  }

  getMessageByQuery(query) {
    return this.dao.getMessageByQuery(query);
  }
}

module.exports = MessagesService;
