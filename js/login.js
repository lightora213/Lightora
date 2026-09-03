import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { auth } from "../firebase.js";


const form = document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const message =
    document.getElementById("loginMessage");

const forgotPassword =
    document.getElementById("forgotPassword");


/* =========================
   LOGIN
========================= */

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!email || !password) {

            showMessage(
                "Please enter your email and password.",
                "error"
            );

            return;

        }


        loginButton.disabled = true;

        loginButton.textContent =
            "Logging in...";


        try {

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            console.log(
                "Logged in user:",
                userCredential.user
            );


            showMessage(
                "Login successful. Redirecting...",
                "success"
            );


            setTimeout(
                function () {

                    window.location.href =
                        "dashboard.html";

                },
                800
            );


        }

        catch (error) {

            console.error(error);


            let errorMessage =
                "Unable to login.";


            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                errorMessage =
                    "Incorrect email or password.";

            }


            else if (
                error.code ===
                "auth/user-not-found"
            ) {

                errorMessage =
                    "No account found with this email.";

            }


            else if (
                error.code ===
                "auth/wrong-password"
            ) {

                errorMessage =
                    "Incorrect password.";

            }


            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                errorMessage =
                    "Please enter a valid email.";

            }


            showMessage(
                errorMessage,
                "error"
            );


            loginButton.disabled = false;

            loginButton.textContent =
                "Login";

        }

    }
);


/* =========================
   FORGOT PASSWORD
========================= */

forgotPassword.addEventListener(
    "click",
    async function (event) {

        event.preventDefault();


        const email =
            emailInput.value.trim();


        if (!email) {

            showMessage(
                "Enter your email first.",
                "error"
            );

            emailInput.focus();

            return;

        }


        try {

            await sendPasswordResetEmail(
                auth,
                email
            );


            showMessage(
                "Password reset email sent.",
                "success"
            );


        }

        catch (error) {

            console.error(error);

            showMessage(
                "Could not send reset email.",
                "error"
            );

        }

    }
);


/* =========================
   MESSAGE
========================= */

function showMessage(
    text,
    type
) {

    message.textContent = text;

    message.style.color =
        type === "success"
            ? "#16803c"
            : "#d93025";

}
