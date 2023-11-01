const form = document.getElementById("resetPasswordForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  for (let [key, value] of data.entries()) {
    obj[key] = value;
  }
  fetch("/api/users/resetpassword", {
    method: "PUT",
    body: JSON.stringify(obj),
    headers: { "Content-Type": "application/json" },
  }).then((result) => {
    if (result.status === 200) {
      showMessage(
        "Contraseña reestablecida",
        "Se ha modificado la contraseña. Seras redireccionado..."
      );
      setTimeout(() => {
        window.location.replace("/login");
      }, 3000);
    } else if (result.status === 400) {
      // Usuario existente
      showMessage("Error", "El usuario no existe.");
    }
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
