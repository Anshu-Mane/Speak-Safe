import { signup, login, auth, db } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";

console.log("Speak-Safe app.js loaded");

// ---------- SIGNUP ----------
async function signupUser() {
  try {
    await signup(
      name.value,
      email.value,
      password.value,
      self.value,
      parent.value,
      alternate.value,
      contacts.value
    );
    alert("Account created successfully");
  } catch (e) {
    alert(e.message);
  }
}

// ---------- LOGIN ----------
async function loginUser() {
  try {
    await login(email.value, password.value);

    authBox.style.display = "none";
    podcastBox.style.display = "block";

    startLocation();
  } catch (e) {
    alert(e.message);
  }
}

// ---------- LOCATION + MAP ----------
let currentLat = null;
let currentLng = null;

function startLocation() {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      currentLat = pos.coords.latitude;
      currentLng = pos.coords.longitude;

      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: currentLat, lng: currentLng }
      });

      new google.maps.Marker({
        position: { lat: currentLat, lng: currentLng },
        map: map
      });
    },
    () => alert("Location access denied")
  );
}

// ---------- KEYWORD DETECTION ----------
function checkKeyword() {
  const text = speech.value.toLowerCase();

  if (text.includes("help") || text.includes("red") || text.includes("send")) {
    sendAlert();
  } else {
    alert("Friend: Are you almost here?");
  }
}

// ---------- ALERT ----------
async function sendAlert() {
  if (!auth.currentUser || currentLat === null) {
    alert("Alert cannot be sent");
    return;
  }

  const mapLink = `https://maps.google.com/?q=${currentLat},${currentLng}`;

  await addDoc(collection(db, "alerts"), {
    userId: auth.currentUser.uid,
    location: mapLink,
    time: new Date(),
    status: "triggered"
  });

  alert("🚨 ALERT SENT\n\n" + mapLink);
}

// ---------- STOP PODCAST ----------
function stopPodcast() {
  const safe = confirm("Have you reached safely?");
  if (!safe) sendAlert();
  else alert("Glad you’re safe");
}

// ---------- EXPOSE TO HTML ----------
window.signupUser = signupUser;
window.loginUser = loginUser;
window.checkKeyword = checkKeyword;
window.stopPodcast = stopPodcast;
