const form = document.getElementById("logoutForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  fetch("/api/users/logout", {
    method: "POST",
  }).then((result) => {
    if (result.status === 200) {
      showMessage(
        "Cierre de sesión exitoso",
        "Se ha cerrado sesión correctamente y serás redireccionado."
      );
      setTimeout(() => {
        window.location.replace("/login");
      }, 3000);
    } else if (result.status === 409) {
      // Usuario existente
      showMessage("Error", "Error del servidor al cerrar sesion.");
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
