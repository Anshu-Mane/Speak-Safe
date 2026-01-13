// Speak-Safe Frontend Prototype Logic (Keyword FIXED)

let audio = document.getElementById("podcastAudio");
let silenceTimer = null;
let lastInteraction = Date.now();
let speechBuffer = "";
let alertTriggered = false;
let podcastRunning = false;

// Start podcast
function startPodcast() {
  if (podcastRunning) return;

  podcastRunning = true;
  alertTriggered = false;
  speechBuffer = "";
  lastInteraction = Date.now();

  audio.play().catch(() => {});

  monitorSilence();
}

// Stop podcast manually
function stopPodcast() {
  // Stop audio
  podcastAudio.pause();
  podcastAudio.currentTime = 0;

  // Stop voice recognition if running
  if (recognition) {
    recognition.stop();
  }

  // Question 1
  const reached = confirm("Have you reached safely?");

  if (reached) {
    alert("Thank you for using Speak-Safe 💙\nSession ended safely.");
    resetDashboard();
    return;
  }

  // Question 2
  const safe = confirm("Are you safe right now?");

  if (safe) {
    alert("Glad you're safe. Returning to dashboard.");
    resetDashboard();
  } else {
    triggerEmergencyAlert("User said they are NOT safe");
  }
}


// Silence detection (10 sec)
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

// Simulated speech (typing)
document.addEventListener("keydown", (e) => {
  if (!podcastRunning || alertTriggered) return;

  lastInteraction = Date.now();

  // Only capture real characters
  if (e.key.length === 1) {
    speechBuffer += e.key.toLowerCase();
  }

  // Check keyword when space / enter is pressed
  if (e.key === " " || e.key === "Enter") {
    detectKeyword();
    speechBuffer = "";
  }
});

// Keyword detection (RELIABLE)
function detectKeyword() {
  const text = speechBuffer.trim();

  const keywords = {
    "help": "HELP",
    "run": "RUN",
    "danger": "DANGER",
    "code red": "CODE RED"
  };

  for (let key in keywords) {
    if (text.includes(key)) {
      triggerAlert(`User said "${keywords[key]}". Location shared.`);
      return;
    }
  }
}

// Trigger alert ONCE
function triggerAlert(message) {
  if (alertTriggered) return;

  alertTriggered = true;
  podcastRunning = false;
  clearInterval(silenceTimer);
  audio.pause();

  // Pass message to alert window
  window.open(
    `alert.html?msg=${encodeURIComponent(message)}`,
    "_blank",
    "width=420,height=520"
  );
}
