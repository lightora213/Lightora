/* =========================
   REGISTER
========================= */

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    auth
} from "../firebase.js";


/* =========================
   REGISTER FORM
========================= */

const registerForm =
    document.getElementById("registerForm");


/* =========================
   SUBMIT
========================= */

registerForm.addEventListener(
    "submit",
    async function (event) {

        // Prevent the browser from
        // sending the form with GET
        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        /* =========================
           BASIC VALIDATION
        ========================== */

        if (!email || !password) {

            alert("Please enter your email and password.");

            return;
        }


        if (password.length < 6) {

            alert("Password must contain at least 6 characters.");

            return;
        }


        /* =========================
           CREATE FIREBASE ACCOUNT
        ========================== */

        try {

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            console.log(
                "Account created:",
                userCredential.user.uid
            );


            /* =========================
               SUCCESS
            ========================== */

            window.location.href =
                "dashboard.html";


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            /* =========================
               FIREBASE ERRORS
            ========================== */

            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                alert(
                    "This email is already registered."
                );


            } else if (
                error.code ===
                "auth/invalid-email"
            ) {

                alert(
                    "Please enter a valid email address."
                );


            } else if (
                error.code ===
                "auth/weak-password"
            ) {

                alert(
                    "Password is too weak. Use at least 6 characters."
                );


            } else {

                alert(
                    "Registration failed. Please try again."
                );

            }

        }

    }
);