const { LogsDaoFactory } = require("../dao/factory");
const logsService = LogsDaoFactory.getDao();
const getAllLogs = async (req, res, next) => {
  try {
    const logs = await logsService.getAllLogs(req);

    if (logs.length > 0) {
      req.logger.debug(logs);
      res.status(200).json({
        success: true,
        logs: logs,
      });
    } else {
      req.logger.debug("No hay logs");
      res.status(200).json({
        success: true,
        logs: "No entries",
      });
    }
    next();
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los logs" });
  }
};
const newLog = async (log, req, res) => {
  try {
    const newLog = await logsService.newLog(log);
    req.logger.debug(newLog);
    res.status(201).json({ success: true, log: log });
  } catch (error) {
    req.logger.error(error);
    res.status(500).json({ success: false, error: "Error al crear el log" });
  }
};

module.exports = {
  getAllLogs,
  newLog,
};
