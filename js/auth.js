function login(role) {
  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("role", role);

  if (role === "elder") {
    window.location.href = "dashboard.html";
  } else {
    window.location.href = "family.html";
  }
}

function checkAuth() {
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "index.html";
  }
}

function checkRole(requiredRole) {
  const role = localStorage.getItem("role");
  if (role !== requiredRole) {
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
