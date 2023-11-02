const TicketsDao = require("../tickets.mongo");

class TicketsService {
  constructor() {
    this.dao = new TicketsDao();
  }

  getAllTickets() {
    return this.dao.getAllTickets();
  }

  newTicket(ticket) {
    return this.dao.newTicket(ticket);
  }

  getTicketById(id) {
    return this.dao.getTicketById(id);
  }

  deleteTicketById(id)
  {
    return this.dao.deleteTicketById(id);
  }
}

module.exports = TicketsService;
