/* =========================
   FIREBASE APP
========================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

/* =========================
   FIREBASE AUTH
========================= */

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

/* =========================
   FIREBASE FIRESTORE
========================= */

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {

    apiKey: "AIzaSyDE6tr7W7rOlp-z7t7Ja67bliLUqOyzXt0",

    authDomain:
        "lightora-10c04.firebaseapp.com",

    projectId:
        "lightora-10c04",

    storageBucket:
        "lightora-10c04.firebasestorage.app",

    messagingSenderId:
        "332875464575",

    appId:
        "1:332875464575:web:3cf6b4b94ecbc2b7e4a44a"

};

/* =========================
   INITIALIZE FIREBASE
========================= */

const app = initializeApp(firebaseConfig);

/* =========================
   AUTH
========================= */

export const auth = getAuth(app);

/* =========================
   FIRESTORE
========================= */

export const db = getFirestore(app);

/* =========================
   AUTH STATE
========================= */

export {
    onAuthStateChanged
};