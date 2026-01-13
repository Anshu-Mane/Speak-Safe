console.log("Speak Safe prototype running");

// ---------- LOCATION ----------
let currentLat = null;
let currentLng = null;
let silenceTimer = null;

function startLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      currentLat = pos.coords.latitude;
      currentLng = pos.coords.longitude;

      const map = new google.maps.Map(
        document.getElementById("map"),
        {
          zoom: 15,
          center: { lat: currentLat, lng: currentLng }
        }
      );

      new google.maps.Marker({
        position: { lat: currentLat, lng: currentLng },
        map,
        title: "User Location"
      });
    },
    () => alert("Location permission denied")
  );
}

startLocation();

// ---------- PODCAST ----------
const podcast = document.getElementById("podcast");

window.startPodcast = () => {
  podcast.play();
  alert("Fake podcast call started 🎧");
  startSilenceTimer();
};

// ---------- KEYWORD DETECTION ----------
window.checkKeyword = () => {
  const text = document.getElementById("speech").value.toLowerCase();

  resetSilenceTimer();

  if (
    text.includes("help") ||
    text.includes("danger") ||
    text.includes("code-red") ||
    text.includes("run")
  ) {
    sendAlert();
  } else {
    alert("Friend: Talk normally, I’m listening 🙂");
  }
};

// ---------- SILENCE DETECTION ----------
function startSilenceTimer() {
  silenceTimer = setTimeout(() => {
    alert("🚨 Silence detected");
    sendAlert();
  }, 180000); // 3 minutes
}

function resetSilenceTimer() {
  clearTimeout(silenceTimer);
  startSilenceTimer();
}

// ---------- ALERT ----------
function sendAlert() {
  if (!currentLat || !currentLng) {
    alert("Location not available");
    return;
  }

  const mapLink = `https://maps.google.com/?q=${currentLat},${currentLng}`;

  alert(
    "🚨 EMERGENCY ALERT\n\n" +
    "Live location shared with contacts\n\n" +
    mapLink +
    "\n\nEmergency number dialed 📞"
  );
}

// ---------- END CALL ----------
window.stopPodcast = () => {
  podcast.pause();
  podcast.currentTime = 0;

  const safe = confirm("Have you reached safely?");
  if (!safe) sendAlert();
  else alert("Session ended. Stay safe 💚");
};
