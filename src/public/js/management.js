document.addEventListener("DOMContentLoaded", function () {
  const userList = document.getElementById("userList");
  const modifyUserButton = document.getElementById("modifyUser");
  const deleteUserButton = document.getElementById("deleteUser");
  const userInfo = document.getElementById("userInfo");
  const userCredentials = {
    email: "email@testing.com.ar",
    password: "testingPassword",
  };
  document.getElementById("userList").addEventListener("change", function () {
    showUserInfo(this.value);
  });

  function showUserInfo(email) {
    fetch(`/api/users/${email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    })
      .then((response) => response.json())
      .then((data) => {
        const userInfo = document.getElementById("userInfo");
        console.log(userInfo);
        if (data.status === "success") {
          const user = data.user;
          userInfo.innerHTML = `Nombre: ${user.first_name}<br>Apellido: ${user.last_name}<br>Edad: ${user.age}<br>Rol: ${user.role}<br>Email: ${user.email}`;
        } else {
          userInfo.innerHTML = "Usuario no encontrado.";
        }
      })

      .catch((error) => {
        console.error("Error al obtener los detalles del usuario:", error);
      });
  }

  modifyUserButton.addEventListener("click", function () {
    const selectedUser = userList.value;

    fetch(`/api/users/premium/${selectedUser}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    })
      .then((response) => response.json())
      .then((data) => {
        // Maneja la respuesta del servidor
        console.log(data);
      })
      .catch((error) => {
        console.error("Error al enviar credenciales:", error);
      });
  });

  deleteUserButton.addEventListener("click", function () {
    const selectedUserId = userList.value;
    // Aquí puedes implementar la lógica para eliminar el usuario seleccionado.
  });
});
