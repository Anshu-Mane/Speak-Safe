import { signup, login } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

function signupUser() {
  signup(
    name.value,
    email.value,
    password.value,
    self.value,
    parent.value,
    alternate.value,
    contacts.value
  );
}

function loginUser() {
  login(email.value, password.value);
}

let currentLat = null;
let currentLng = null;
/*Google Map and Live location */
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
    () => {
      alert("Location access denied");
    }
  );
}
/*Fake Podcast*/
function startPodcast() {
  document.getElementById("podcastStatus").innerText =
    "🎧 Fake podcast started… Talk naturally.";
}
/*Keyword Detection */
function checkKeyword() {
  const speechText =
    document.getElementById("speech").value.toLowerCase();

  if (
    speechText.includes("help") ||
    speechText.includes("red") ||
    speechText.includes("send")
  ) {
    sendAlert();
  } else {
    alert("Friend: Are you almost here?");
  }
}
/*Alert genration */
function sendAlert() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("User not logged in");
      return;
    }

    if (currentLat === null || currentLng === null) {
      alert("Location not available yet");
      return;
    }

    const mapLink =
      `https://maps.google.com/?q=${currentLat},${currentLng}`;

    await addDoc(collection(db, "alerts"), {
      userId: user.uid,
      location: mapLink,
      time: new Date(),
      status: "triggered"
    });

    alert(
      "🚨 ALERT SENT\n\n" +
      "Location shared with saved contacts\n\n" +
      mapLink
    );
  });
}
/*Podcast stop logic*/
function stopPodcast() {
  const safe = confirm("Have you reached safely?");

  if (!safe) {
    sendAlert();
  } else {
    alert("Glad you’re safe 💚");
  }
}