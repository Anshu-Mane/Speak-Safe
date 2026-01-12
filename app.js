console.log("Speak-Safe prototype running");

// ---------- LOCATION + MAP ----------
let currentLat = null;
let currentLng = null;

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
        map: map,
        title: "You are here"
      });
    },
    () => alert("Location access denied")
  );
}

// Start location immediately
startLocation();

// ---------- KEYWORD DETECTION ----------
function checkKeyword() {
  const text = document
    .getElementById("speech")
    .value
    .toLowerCase();

  if (
    text.includes("help") ||
    text.includes("red") ||
    text.includes("send")
  ) {
    sendAlert();
  } else {
    alert("Friend: Are you almost here?");
  }
}

// ---------- ALERT SIMULATION ----------
function sendAlert() {
  if (currentLat === null || currentLng === null) {
    alert("Location not available yet");
    return;
  }

  const mapLink =
    `https://maps.google.com/?q=${currentLat},${currentLng}`;

  alert(
    "🚨 ALERT TRIGGERED\n\n" +
    "Location shared with trusted contacts\n\n" +
    mapLink
  );
}

// ---------- STOP PODCAST ----------
function stopPodcast() {
  const safe = confirm("Have you reached safely?");
  if (!safe) sendAlert();
  else alert("Glad you’re safe 💚");
}

// Expose functions to HTML
window.checkKeyword = checkKeyword;
window.stopPodcast = stopPodcast;

