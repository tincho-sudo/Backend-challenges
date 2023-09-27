const LogsDao = require("../logs.mongo");

class LogsService {
  constructor() {
    this.dao = new LogsDao();
  }

  getAllLogs() {
    return this.dao.getAllLogs();
  }

  newLog(log) {
    return async (_, res) => {
        res.status(200).json({ success: true, log: "Log created" });
        await this.dao.newLog(log);
    };
  }

}

module.exports = LogsService;
