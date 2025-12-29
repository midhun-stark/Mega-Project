function loadDashboard() {
  const alertCard = document.getElementById("alertCard");
  const meds = JSON.parse(localStorage.getItem("medicines")) || [];

  const missed = meds.filter(m => isMissed(m.time, m.taken));

  if (missed.length > 0) {
    alertCard.innerHTML = `
      <h3 style="color:#D96A6A;">⚠ Missed Medicines</h3>
      <p>${missed.length} medicine(s) not taken yet</p>
    `;
  } else {
    alertCard.innerHTML = `
      <h3>✔ All medicines on track</h3>
      <p>No missed medicines today</p>
    `;
  }
}

/* Same missed logic (frontend-safe duplication) */
function isMissed(medTime, taken) {
  if (taken) return false;

  const now = new Date();
  const [h, m] = medTime.split(":").map(Number);

  const medDate = new Date();
  medDate.setHours(h, m, 0, 0);

  return now > medDate;
}
