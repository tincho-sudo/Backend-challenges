const Log = require("./models/log.model.js");
class LogsDaoMongo {
  constructor() {}

  getAllLogs = async () => {
    try {
      const log = await Log.find();
      return log;
    } catch (error) {
      throw error;
    }
  };

  newLog = async (log) => {
    try {
      const newLog = await Log.create(log);
      return newLog;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = LogsDaoMongo;
