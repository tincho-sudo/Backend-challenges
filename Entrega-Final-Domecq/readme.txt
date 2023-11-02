Deje la vista de front del backoffice terminada (solo se muestra a quien sea admin del sitio), pero no voy a poder dejarla funcionando mas alla de cargar el select
con los email de la lista de usuarios. El motivo es no me parece bien sacarle el auth al getUsers del router, tampoco hacer una
ruta setPremium que no este protegida ni una deleteUser por el mismo motivo.

Si hago un fetch desde un script del front a una ruta que traiga los datos de los usuarios, no esta autorizado por falta de credenciales
No use jwt en mi proyecto, asi que usar el header de Authorization no seria una opcion,
Intente usar credentials: 'include', pero tampoco funciono. 