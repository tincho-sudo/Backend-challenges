const form = document.getElementById("logoutForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  window.location.replace("/logout");
});
