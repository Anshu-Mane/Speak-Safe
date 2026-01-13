// Speak-Safe Frontend Prototype Logic (Stable + Stop Button)

let audio = document.getElementById("podcastAudio");
let silenceTimer = null;
let lastInteraction = Date.now();
let speechBuffer = "";
let alertTriggered = false;
let podcastRunning = false;

// Start fake podcast
function startPodcast() {
  if (podcastRunning) return;

  podcastRunning = true;
  alertTriggered = false;
  speechBuffer = "";
  lastInteraction = Date.now();

  audio.play().catch(() => {
    console.log("Audio blocked until user interaction");
  });

  monitorSilence();
}

// Stop podcast manually (safe stop)
function stopPodcast() {
  podcastRunning = false;
  clearInterval(silenceTimer);
  audio.pause();
  speechBuffer = "";
}

// Monitor silence (10 seconds)
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

// Simulated speech via typing
document.addEventListener("keydown", (e) => {
  if (!podcastRunning || alertTriggered) return;

  lastInteraction = Date.now();

  if (e.key.length === 1) {
    speechBuffer += e.key.toLowerCase();
  }

  detectKeyword();
});

// Keyword detection
function detectKeyword() {
  const keywords = ["help", "code red", "danger", "run"];

  for (let word of keywords) {
    if (speechBuffer.includes(word)) {
      triggerAlert(`Keyword detected: ${word}`);
      break;
    }
  }

  if (speechBuffer.length > 100) {
    speechBuffer = speechBuffer.slice(-50);
  }
}

// Trigger alert ONLY ONCE
function triggerAlert(reason) {
  if (alertTriggered) return;

  alertTriggered = true;
  podcastRunning = false;
  clearInterval(silenceTimer);
  audio.pause();

  console.log("ALERT:", reason);

  window.open(
    "alert.html",
    "_blank",
    "width=400,height=500"
  );
}



