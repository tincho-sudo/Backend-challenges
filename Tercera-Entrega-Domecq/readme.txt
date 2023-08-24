Actualmente tengo un error en la carga del DAO de ticket,

-----------------------------------------------------------------
\Tercera-Entrega-Domecq\src\controllers\tickets.controller.js:2
const ticketsService = TicketsDaoFactory.getDao();
                                         ^

TypeError: TicketsDaoFactory.getDao is not a function

-----------------------------------------------------------------

No tiene sentido porque la estructura es la misma que en el resto de la factory, pero estoy investigando..
