import {
    getMyStore,
    saveStore
} from "./services/storeService.js";

import {
    auth,
    onAuthStateChanged
} from "../firebase.js";


/* =========================
   FORM
========================= */

const form =
    document.getElementById("storeForm");

const storeName =
    document.getElementById("storeName");

const storeDescription =
    document.getElementById("storeDescription");

const storePhone =
    document.getElementById("storePhone");

const storeEmail =
    document.getElementById("storeEmail");

const storeAddress =
    document.getElementById("storeAddress");


/* =========================
   WAIT FOR AUTH
========================= */

function waitForAuth() {

    return new Promise(function(resolve) {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                function(user) {

                    unsubscribe();

                    resolve(user);

                }
            );

    });

}


/* =========================
   LOAD STORE DATA
========================= */

async function loadStore() {

    try {

        const user =
            await waitForAuth();


        if (!user) {

            console.warn(
                "No user is logged in."
            );

            return;

        }


        console.log(
            "Store settings user:",
            user.email
        );


        const store =
            await getMyStore();


        if (!store) {

            console.log(
                "No store settings found yet."
            );

            return;

        }


        if (storeName) {

            storeName.value =
                store.name || "";

        }


        if (storeDescription) {

            storeDescription.value =
                store.description || "";

        }


        if (storePhone) {

            storePhone.value =
                store.phone || "";

        }


        if (storeEmail) {

            storeEmail.value =
                store.email || "";

        }


        if (storeAddress) {

            storeAddress.value =
                store.address || "";

        }


        console.log(
            "Store settings loaded successfully:",
            store
        );

    }

    catch (error) {

        console.error(
            "Error loading store settings:",
            error
        );

        alert(
            "Unable to load store settings."
        );

    }

}


/* =========================
   SAVE STORE
========================= */

if (form) {

    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                storeName
                    ? storeName.value.trim()
                    : "";


            if (!name) {

                alert(
                    "Please enter your store name."
                );

                return;

            }


            const button =
                form.querySelector(
                    'button[type="submit"]'
                );


            try {

                if (button) {

                    button.disabled =
                        true;

                    button.textContent =
                        "Saving...";

                }


                /* =========================
                   STORE DATA
                ========================= */

                const store = {

                    name:
                        name,

                    description:
                        storeDescription
                            ? storeDescription.value.trim()
                            : "",

                    phone:
                        storePhone
                            ? storePhone.value.trim()
                            : "",

                    email:
                        storeEmail
                            ? storeEmail.value.trim()
                            : "",

                    address:
                        storeAddress
                            ? storeAddress.value.trim()
                            : ""

                };


                console.log(
                    "Saving store:",
                    store
                );


                /* =========================
                   SAVE TO FIRESTORE
                ========================= */

                await saveStore(
                    store
                );


                alert(
                    "Store settings saved successfully."
                );


                if (button) {

                    button.textContent =
                        "Saved ✓";

                }

            }

            catch (error) {

                console.error(
                    "Error saving store settings:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to save store settings."
                );


                if (button) {

                    button.textContent =
                        "Save Changes";

                }

            }

            finally {

                if (button) {

                    button.disabled =
                        false;

                }

            }

        }
    );

}


/* =========================
   START
========================= */

loadStore();