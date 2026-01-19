/* =========================
   DAILY RESET AT MIDNIGHT
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
  meds.forEach(med => med.taken = false);
  localStorage.setItem("medicines", JSON.stringify(meds));
}

/* =========================
   LOAD MEDICINES
   ========================= */
function loadMedicines() {
  const role = localStorage.getItem("role");
  const list = document.getElementById("medicineList");
  const addCard = document.getElementById("addMedCard");

  list.innerHTML = "";

  // Show Add Medicine for Elder & Family
  if (role === "elder" || role === "family") {
    addCard.style.display = "block";
  } else {
    addCard.style.display = "none";
  }

  const meds = JSON.parse(localStorage.getItem("medicines")) || [];

  if (meds.length === 0) {
    list.innerHTML = `<p class="subtitle">No medicines added</p>`;
    return;
  }

  meds.forEach((med, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const missed = isMissed(med.time, med.taken);

    card.innerHTML = `
      <h3>${med.name}</h3>
      <p>⏰ ${med.time}</p>
      ${missed ? `<p style="color:#D96A6A;">⚠ Missed</p>` : ""}
    `;

    // Elder controls
    if (role === "elder") {
      card.innerHTML += `
        <button ${med.taken ? "disabled" : ""} onclick="markTaken(${index})">
          ${med.taken ? "✔ Taken" : "✔ Mark as Taken"}
        </button>
        <button onclick="editMedicine(${index})">✏️ Edit</button>
      `;
    }

    // Family controls
    if (role === "family") {
      card.innerHTML += `
        <button onclick="editMedicine(${index})">✏️ Edit</button>
        <button class="danger" onclick="deleteMedicine(${index})">🗑 Delete</button>
      `;
    }

    list.appendChild(card);
  });
}

/* =========================
   ADD MEDICINE
   ========================= */
function addMedicine() {
  const name = document.getElementById("medName").value.trim();
  const time = document.getElementById("medTime").value;

  if (!name || !time) {
    alert("Please enter medicine name and time");
    return;
  }

  const meds = JSON.parse(localStorage.getItem("medicines")) || [];
  meds.push({ name, time, taken: false });

  localStorage.setItem("medicines", JSON.stringify(meds));

  document.getElementById("medName").value = "";
  document.getElementById("medTime").value = "";

  loadMedicines();
}

/* =========================
   EDIT MEDICINE
   ========================= */
function editMedicine(index) {
  const meds = JSON.parse(localStorage.getItem("medicines")) || [];
  const med = meds[index];

  const newName = prompt("Edit medicine name:", med.name);
  const newTime = prompt("Edit medicine time (HH:MM):", med.time);

  if (!newName || !newTime) return;

  meds[index].name = newName;
  meds[index].time = newTime;

  localStorage.setItem("medicines", JSON.stringify(meds));
  loadMedicines();
}

/* =========================
   DELETE MEDICINE (Family)
   ========================= */
function deleteMedicine(index) {
  if (!confirm("Are you sure you want to delete this medicine?")) return;

  const meds = JSON.parse(localStorage.getItem("medicines")) || [];
  meds.splice(index, 1);

  localStorage.setItem("medicines", JSON.stringify(meds));
  loadMedicines();
}

/* =========================
   MARK AS TAKEN (Elder)
   ========================= */
function markTaken(index) {
  const meds = JSON.parse(localStorage.getItem("medicines")) || [];
  meds[index].taken = true;

  localStorage.setItem("medicines", JSON.stringify(meds));

  logWeekly(true); // weekly adherence log
  loadMedicines();
}

/* =========================
   MISSED MEDICINE CHECK
   ========================= */
function isMissed(time, taken) {
  if (taken) return false;

  const now = new Date();
  const [hours, minutes] = time.split(":").map(Number);
  const medTime = new Date();
  medTime.setHours(hours, minutes, 0, 0);

  const missed = now > medTime;

  if (missed) {
    logWeekly(false); // weekly adherence log
  }

  return missed;
}

/* =========================
   WEEKLY ADHERENCE LOGGER
   ========================= */
function logWeekly(taken) {
  const log = JSON.parse(localStorage.getItem("weeklyLog")) || [];
  log.push({
    date: new Date().toISOString(),
    taken: taken
  });
  localStorage.setItem("weeklyLog", JSON.stringify(log));
}
