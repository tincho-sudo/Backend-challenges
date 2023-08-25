Actualmente tengo un error en la carga del DAO de ticket,

-----------------------------------------------------------------
\Tercera-Entrega-Domecq\src\controllers\tickets.controller.js:2
const ticketsService = TicketsDaoFactory.getDao();
                                         ^

TypeError: TicketsDaoFactory.getDao is not a function

-----------------------------------------------------------------

No tiene sentido porque la estructura es la misma que en el resto de la factory, pero estoy investigando..
Finalmente lo resolvi, el problema es la constante modificacion y remodificacion con los nuevos patrones que hace que todo termine atado con hilos.

Punto aparte, deshabilite cors porque me estaba bloqueando las solicitudes del postman
