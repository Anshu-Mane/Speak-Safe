// Speak-Safe Frontend Prototype Logic (FINAL FIXED)

let audio = document.getElementById("podcastAudio");
let silenceTimer = null;
let lastInteraction = Date.now();
let speechBuffer = "";
let alertTriggered = false;
let podcastRunning = false;

/* ---------------- LOCATION ---------------- */
function getLocation(callback) {
  if (!navigator.geolocation) {
    callback("Location unavailable", "N/A");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(4);
      const lon = pos.coords.longitude.toFixed(4);

      // Prototype-friendly location name
      const placeName = "Near Main Road / Public Area";

      callback(placeName, `${lat}, ${lon}`);
    },
    () => callback("Location unavailable", "N/A")
  );
}

/* ---------------- START PODCAST ---------------- */
function startPodcast() {
  if (podcastRunning) return;

  podcastRunning = true;
  alertTriggered = false;
  speechBuffer = "";
  lastInteraction = Date.now();

  audio.play().catch(() => {});
  monitorSilence();
}

/* ---------------- STOP PODCAST ---------------- */
function stopPodcast() {
  podcastRunning = false;
  clearInterval(silenceTimer);
  audio.pause();
  audio.currentTime = 0;

  // Open YES / NO decision window
  window.open(
    "stop-check.html",
    "_blank",
    "width=420,height=520"
  );
}

/* ---------------- SILENCE DETECTION ---------------- */
function monitorSilence() {
  silenceTimer = setInterval(() => {
    if (
      podcastRunning &&
      !alertTriggered &&
      Date.now() - lastInteraction > 10000
    ) {
      triggerAlert("No response detected");
    }
  }, 1000);
}

/* ---------------- SIMULATED VOICE (TYPING) ---------------- */
document.addEventListener("keydown", (e) => {
  if (!podcastRunning || alertTriggered) return;

  lastInteraction = Date.now();

  if (e.key.length === 1) {
    speechBuffer += e.key.toLowerCase();
  }

  if (e.key === " " || e.key === "Enter") {
    detectKeyword();
    speechBuffer = "";
  }
});

/* ---------------- KEYWORD DETECTION ---------------- */
function detectKeyword() {
  const text = speechBuffer.trim();

  const keywords = ["help", "run", "danger", "code red"];

  for (let word of keywords) {
    if (text.includes(word)) {
      triggerAlert(`User said "${word.toUpperCase()}"`);
      return;
    }
  }
}

/* ---------------- ALERT (ONCE ONLY) ---------------- */
function triggerAlert(reason) {
  if (alertTriggered) return;

  alertTriggered = true;
  podcastRunning = false;
  clearInterval(silenceTimer);
  audio.pause();

  getLocation((place, coords) => {
    const message =
      "🚨 EMERGENCY ALERT 🚨\n\n" +
      reason + "\n\n" +
      "📍 Location:\n" +
      place + "\n" +
      "Coordinates: " + coords;

    window.open(
      `alert.html?msg=${encodeURIComponent(message)}`,
      "_blank",
      "width=420,height=520"
    );
  });
}

/* ---------------- EXPOSE TO HTML ---------------- */
window.startPodcast = startPodcast;
window.stopPodcast = stopPodcast;
