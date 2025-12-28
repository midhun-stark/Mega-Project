console.log("auth.js loaded successfully");

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("loginBtn");

  if (btn) {
    btn.addEventListener("click", function () {
      console.log("Login button clicked"); // DEBUG

      localStorage.setItem("loggedIn", "true");
      window.location.href = "dashboard.html";
    });
  }
});

function checkAuth() {
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
document.addEventListener("DOMContentLoaded", checkAuth);