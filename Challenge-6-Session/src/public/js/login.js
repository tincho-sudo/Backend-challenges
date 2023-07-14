const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  Object.entries(data).forEach(([key, value]) => {
    obj[key] = value;
  });
  fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) {
      window.location.replace("/");
    }
  });
});
