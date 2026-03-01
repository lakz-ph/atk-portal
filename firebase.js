import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQ_4oFtihri8lK0GAJJ1bdxpZIFxeTi90",
  authDomain: "atkportal.firebaseapp.com",
  projectId: "atkportal",
  storageBucket: "atkportal.appspot.com",
  messagingSenderId: "542591489393",
  appId: "1:542591489393:web:5b11443f7e0e3ef90152d0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);