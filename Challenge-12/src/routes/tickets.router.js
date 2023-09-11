const express = require("express");
const router = express.Router();

const {
  newTicket,
  getTicketById,
  getAllTickets,
  deleteTicketById,
} = require("../controllers/tickets.controller");
// Crear un nuevo Ticket
router.post("/", newTicket);

// Obtener ticket (pasar por params el id)
router.get("/:tid", getTicketById);

// Eliminar un ticket (pasar por params id)
router.delete("/:tid", deleteTicketById);

// Obtener todos los tickets
router.get("/", getAllTickets);

// Actualizar el ticket con un arreglo de productos (pasar por array de productos)
//router.put("/:tid", updateTicketById);

// Actualizar la cantidad de un producto en el ticket (pasar por body la cantidad)
//router.put("/:tid/products/:pid", updateProductFromTicketById);

module.exports = { router };
