/* =========================
   DAILY RESET (runs once per day)
   ========================= */

checkDailyReset();

function checkDailyReset() {
  const today = new Date().toDateString();
  const lastReset = localStorage.getItem("lastResetDate");

  if (lastReset !== today) {
    resetDailyMedicines();
    localStorage.setItem("lastResetDate", today);
  }
}

function resetDailyMedicines() {
  const meds = JSON.parse(localStorage.getItem("medicines")) || [];

  meds.forEach(med => {
    med.taken = false;
  });

  localStorage.setItem("medicines", JSON.stringify(meds));
}

/* =========================
   MEDICINE PAGE LOGIC
   ========================= */

function loadMedicines() {
  const list = document.getElementById("medicineList");
  list.innerHTML = "";

  const meds = JSON.parse(localStorage.getItem("medicines")) || [];

  if (meds.length === 0) {
    list.innerHTML = `<p class="subtitle">No medicines added yet</p>`;
    return;
  }

  meds.forEach((med, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const missed = isMissed(med.time, med.taken);

    card.innerHTML = `
      <h3>${med.name}</h3>
      <p>⏰ ${med.time}</p>
      ${missed ? `<p style="color:#D96A6A;font-weight:600;">⚠ Missed</p>` : ""}
      <button
        class="${med.taken ? "disabled" : "secondary"}"
        ${med.taken ? "disabled" : ""}
        onclick="markTaken(${index})">
        ${med.taken ? "✔ Taken" : "✔ Mark as Taken"}
      </button>
    `;

    list.appendChild(card);
  });
}

function addMedicine() {
  const name = document.getElementById("medName").value.trim();
  const time = document.getElementById("medTime").value.trim(); // HH:MM

  if (!name || !time) {
    alert("Please enter medicine name and time (HH:MM)");
    return;
  }

  if (!/^\d{2}:\d{2}$/.test(time)) {
    alert("Time must be in HH:MM format (e.g. 09:00)");
    return;
  }

  const meds = JSON.parse(localStorage.getItem("medicines")) || [];

  meds.push({
    name,
    time,
    taken: false
  });

  localStorage.setItem("medicines", JSON.stringify(meds));

  document.getElementById("medName").value = "";
  document.getElementById("medTime").value = "";

  loadMedicines();
}

function markTaken(index) {
  const meds = JSON.parse(localStorage.getItem("medicines")) || [];
  meds[index].taken = true;
  localStorage.setItem("medicines", JSON.stringify(meds));
  loadMedicines();
}

/* =========================
   MISSED MEDICINE CHECK
   ========================= */

function isMissed(medTime, taken) {
  if (taken) return false;

  const now = new Date();
  const [h, m] = medTime.split(":").map(Number);

  const medDate = new Date();
  medDate.setHours(h, m, 0, 0);

  return now > medDate;
}
