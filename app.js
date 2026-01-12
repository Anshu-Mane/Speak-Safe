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