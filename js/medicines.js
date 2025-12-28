function loadMedicines() {
  const list = document.getElementById("medicineList");
  list.innerHTML = "";

  const meds = JSON.parse(localStorage.getItem("medicines")) || [];

  meds.forEach((med, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${med.name}</h3>
      <p>${med.time}</p>
      <button class="${med.taken ? 'disabled' : 'secondary'}"
        ${med.taken ? 'disabled' : ''}
        onclick="markTaken(${i})">
        ${med.taken ? '✔ Taken' : '✔ Mark Taken'}
      </button>
    `;
    list.appendChild(card);
  });
}

function addMedicine() {
  const name = medName.value;
  const time = medTime.value;
  if (!name || !time) return;

  const meds = JSON.parse(localStorage.getItem("medicines")) || [];
  meds.push({ name, time, taken: false });
  localStorage.setItem("medicines", JSON.stringify(meds));

  medName.value = "";
  medTime.value = "";
  loadMedicines();
}

function markTaken(i) {
  const meds = JSON.parse(localStorage.getItem("medicines"));
  meds[i].taken = true;
  localStorage.setItem("medicines", JSON.stringify(meds));
  loadMedicines();
}
