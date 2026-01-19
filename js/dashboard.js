function loadDashboard() {
  showGreeting();
  calculateWeeklyAdherence();
}

/* =========================
   GREETING
   ========================= */
function showGreeting() {
  const hour = new Date().getHours();
  const greet =
    hour < 12 ? "Good Morning" :
    hour < 18 ? "Good Afternoon" :
    "Good Evening";

  document.getElementById("greeting").innerText = `${greet}, Ravi`;
}

/* =========================
   WEEKLY ADHERENCE LOGIC
   ========================= */
function calculateWeeklyAdherence() {
  const log = JSON.parse(localStorage.getItem("weeklyLog")) || [];
  const weekLog = getCurrentWeek(log);

  const taken = weekLog.filter(e => e.taken).length;
  const missed = weekLog.filter(e => !e.taken).length;
  const total = taken + missed;

  const percent = total === 0 ? 0 : Math.round((taken / total) * 100);

  document.getElementById("weeklyTaken").innerText = `Taken: ${taken}`;
  document.getElementById("weeklyMissed").innerText = `Missed: ${missed}`;
  document.getElementById("weeklyPercent").innerHTML =
    `<strong>Adherence: ${percent}%</strong>`;
}

/* =========================
   FILTER CURRENT WEEK
   ========================= */
function getCurrentWeek(log) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  return log.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= startOfWeek;
  });
}
