const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  for (let [key, value] of data.entries()) {
    obj[key] = value;
  }
  fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => {
      if (result.status === 200) {
        showMessage(
          "Inicio de sesión exitoso",
          "Se ha iniciado sesión correctamente. Serás redireccionado"
        );
        // Redireccionar a la página principal
        setTimeout(() => {
          window.location.replace("/");
        }, 3000);
      } else if (result.status === 401) {
        showMessage(
          "Error de inicio de sesión",
          "Las credenciales ingresadas son inválidas."
        );
      } else if (result.status === 500) {
        // Usuario existente
        showMessage("Error", "Usuario o contraseña incorrectos.");
      }
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error);
    });
});

function showMessage(title, message) {
  const messageContainer = document.getElementById("messageContainer");
  messageContainer.innerHTML = `
    <div class="message">
      <h2>${title}</h2>
      <p>${message}</p>
    </div>
  `;
  messageContainer.style.display = "block";
}
