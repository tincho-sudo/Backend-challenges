const Ticket = require("./models/ticket.model");
class TicketsDaoMongo {
  constructor() {}

  getAllTickets = async () => {
    try {
      const ticket = await Ticket.find();
      return ticket;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  newTicket = async (ticket) => {
    try {
      console.log(ticket);
      const newTicket = await Ticket.create(ticket);
      return newTicket;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  getTicketById = async (id) => {
    try {
      const ticket = await Ticket.findOne(id);
      return ticket;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  deleteTicketById = async (id) => {
    try {
      const deletedTicket = await Ticket.findByIdAndDelete(id);
      return deletedTicket;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

module.exports = TicketsDaoMongo;
