// Firebase SDKs
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc
} from "firebase/firestore";

// Firebase configuration (YOUR REAL CONFIG)
const firebaseConfig = {
  apiKey: "AIzaSyCUyepgIYsw1t0NPSRU1B1MffjzMRS2GW4",
  authDomain: "speak-safe-401ee.firebaseapp.com",
  projectId: "speak-safe-401ee",
  storageBucket: "speak-safe-401ee.firebasestorage.app",
  messagingSenderId: "1071683745134",
  appId: "1:1071683745134:web:1359a9a54297bdf4e7bd7f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

// ---------- SIGNUP ----------
export async function signup(
  name,
  email,
  password,
  self,
  parent,
  alternate,
  contacts
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  const contactArray = contacts.split(",");

  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    email,
    self,
    parent,
    alternate,
    contacts: contactArray,
    active: false
  });

  return true;
}

// ---------- LOGIN ----------
export async function login(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
  return true;
}
