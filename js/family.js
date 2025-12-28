function loadFamily() {
  const list = document.getElementById("familyMeds");
  const meds = JSON.parse(localStorage.getItem("medicines")) || [];
  list.innerHTML = "";

  meds.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m.taken
      ? `✔ ${m.name} taken`
      : `⚠ ${m.name} not taken`;
    list.appendChild(li);
  });
}
