const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  for (let [key, value] of data.entries()) {
    obj[key] = value;
  }
  fetch("/api/users/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => {
      if (result.status === 201) {
        // Registro exitoso
        showMessage(
          "Registro exitoso",
          "El usuario ha sido registrado correctamente. Serás redireccionado"
        );
        // Redireccionar a la página de inicio de sesión
        setTimeout(() => {
          window.location.replace("/login");
        }, 3000);
      } else if (result.status === 409) {
        // Usuario existente
        showMessage("Error de registro", "El usuario ya existe.");
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
