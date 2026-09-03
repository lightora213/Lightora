import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    auth
} from "../firebase.js";


onAuthStateChanged(
    auth,
    function (user) {

        if (!user) {

            window.location.href =
                "login.html";

        }

    }
);