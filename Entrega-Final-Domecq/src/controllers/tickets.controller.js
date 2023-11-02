//const { TicketsDaoFactory } = require("../dao/factory.js");
//const ticketsService = TicketsDaoFactory.getDao();
const newTicket = async (ticket, res) => {
  try {
    console.log("ticket: ", ticket);
    const newTicket = await ticketsService.newTicket(ticket);
    return res.status(200).json({ success: true, cart: newTicket });
  } catch (error) {
    req.logger.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Error al crear el ticket" });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.tid;
    const ticketFound = await ticketsService.getTicketById(ticketId);
    if (ticketFound) {
      req.logger.debug(ticketFound);
      return res.status(200).json({
        success: true,
        message: ticketFound,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, error: "Ticket no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener el Ticket" });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketsService.getAllTickets();

    if (tickets) {
      req.logger.debug(tickets);
      return res.status(200).json({
        success: true,
        tickets: tickets,
      });
    }
    next();
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los tickets" });
  }
};

const deleteTicketById = async (req, res) => {
  try {
    const id = req.params.tid;
    const deletedTicket = await ticketsService.deleteTicketById(id);
    if (deletedTicket) req.logger.debug(deletedTicket);
    return res
      .status(200)
      .json({ success: true, deletedTicket: deletedTicket });
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar el ticket" });
  }
};
module.exports = {
  newTicket,
  getTicketById,
  getAllTickets,
  deleteTicketById,
};
