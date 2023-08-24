const MessagesDao = require("../messages.mongo");

class MessagesService {
  constructor() {
    this.dao = new MessagesDao();
  }

  getAllMessages() {
    return this.dao.getAllMessages();
  }

  newMessage(message) {
    return async (req, res) => {
      if (req.user.role === "user") {
        res.status(200).json({ success: true, message: "Product created" });
        await this.dao.newMessage(message);
      } else {
        res.status(403).json({ success: false, error: "Unauthorized" });
      }
    };
  }

  getMessageById(id) {
    return this.dao.getMessageById(id);
  }

  getMessageByQuery(query) {
    return this.dao.getMessageByQuery(query);
  }

  find(query,limit){
    return this.dao.find(query,limit)
  }
}

module.exports = MessagesService;
