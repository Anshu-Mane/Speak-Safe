import { signup, login } from "./firebase.js";

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
