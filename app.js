// Speak-Safe Frontend Prototype Logic

let audio = document.getElementById("podcastAudio");
let silenceTimer = null;
let lastInteraction = Date.now();

// Start fake podcast
function startPodcast() {
  audio.play().catch(() => {
    console.log("Audio play blocked until user interaction");
  });

  lastInteraction = Date.now();
  monitorSilence();
}

// Monitor silence (10 seconds)
function monitorSilence() {
  silenceTimer = setInterval(() => {
    if (Date.now() - lastInteraction > 10000) {
      triggerAlert();
    }
  }, 1000);
}

// Simulate voice activity (typing = speaking)
document.addEventListener("keydown", () => {
  lastInteraction = Date.now();
});

// Open alert window instead of popup
function triggerAlert() {
  clearInterval(silenceTimer);
  audio.pause();
  window.open("alert.html", "_blank", "width=400,height=500");
}


