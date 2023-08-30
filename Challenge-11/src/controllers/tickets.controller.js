//const { TicketsDaoFactory } = require("../dao/factory.js");
//const ticketsService = TicketsDaoFactory.getDao();
const newTicket = async (ticket, res) => {
  try {
    console.log("ticket: ", ticket);
    const newTicket = await ticketsService.newTicket(ticket);
    return res.status(200).json({ success: true, cart: newTicket });
  } catch (error) {
    console.error(error);
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

const getAllTickets = async (_, res) => {
  try {
    const tickets = await ticketsService.getAllTickets();

    if (tickets) {
      return res.status(200).json({
        success: true,
        tickets: tickets,
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener los tickets" });
  }
};

const deleteTicketById = async (req, res) => {
  try {
    const id = req.params.tid;
    const deletedticket = await ticketsService.deleteTicketById(id);

    return res
      .status(200)
      .json({ success: true, deletedticket: deletedticket });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar el mensaje" });
  }
};
module.exports = {
  newTicket,
  getTicketById,
  getAllTickets,
  deleteTicketById,
};
