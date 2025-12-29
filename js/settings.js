function loadSettings() {
  // Apply saved settings on page load
  const textSize = localStorage.getItem("textSize") || "medium";
  const theme = localStorage.getItem("theme") || "normal";

  applyTextSize(textSize);
  applyTheme(theme);
}

/* TEXT SIZE */
function setTextSize(size) {
  localStorage.setItem("textSize", size);
  applyTextSize(size);
}

function applyTextSize(size) {
  document.body.classList.remove("text-small", "text-medium", "text-large");
  document.body.classList.add(`text-${size}`);
}

/* SOUND */
function setSound(value) {
  localStorage.setItem("sound", value);
  alert(`Sound ${value ? "enabled" : "disabled"}`);
}

/* THEME */
function setTheme(mode) {
  localStorage.setItem("theme", mode);
  applyTheme(mode);
}

function applyTheme(mode) {
  document.body.classList.remove("theme-warm");

  if (mode === "warm") {
    document.body.classList.add("theme-warm");
  }
}
