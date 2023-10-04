const Ticket = require("./models/ticket.model");
class TicketsDaoMongo {
  constructor() {}

  getAllTickets = async () => {
    try {
      const ticket = await Ticket.find();
      return ticket;
    } catch (error) {
      throw error;
    }
  };

  newTicket = async (ticket) => {
    try {
      console.log(ticket);
      const newTicket = await Ticket.create(ticket);
      return newTicket;
    } catch (error) {
      throw error;
    }
  };
  getTicketById = async (id) => {
    try {
      const ticket = await Ticket.findOne(id);
      return ticket;
    } catch (error) {
      throw error;
    }
  };

  deleteTicketById = async (id) => {
    try {
      const deletedTicket = await Ticket.findByIdAndDelete(id);
      return deletedTicket;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = TicketsDaoMongo;
