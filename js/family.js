function loadFamily() {
  const list = document.getElementById("familyMeds");
  const meds = JSON.parse(localStorage.getItem("medicines")) || [];

  list.innerHTML = "";

  if (meds.length === 0) {
    list.innerHTML = "<li>No medicines added</li>";
    return;
  }

  meds.forEach(med => {
    const li = document.createElement("li");

    if (med.taken) {
      li.textContent = `✔ ${med.name} – Taken`;
    } else if (isMissed(med.time, med.taken)) {
      li.textContent = `⚠ ${med.name} – Missed`;
      li.style.color = "#D96A6A";
    } else {
      li.textContent = `⏳ ${med.name} – Pending`;
    }

    list.appendChild(li);
  });
}

/* Same missed logic */
function isMissed(medTime, taken) {
  if (taken) return false;

  const now = new Date();
  const [h, m] = medTime.split(":").map(Number);

  const medDate = new Date();
  medDate.setHours(h, m, 0, 0);

  return now > medDate;
}
