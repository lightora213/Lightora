import {
    db,
    auth
} from "../../firebase.js";

import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* =========================
   GET CURRENT USER STORE
========================= */

export async function getMyStore() {

    const user =
        auth.currentUser;


    if (!user) {

        throw new Error(
            "User is not logged in."
        );

    }


    const storeReference =
        doc(
            db,
            "stores",
            user.uid
        );


    const storeSnapshot =
        await getDoc(
            storeReference
        );


    /* =========================
       CREATE DEFAULT STORE
       IF IT DOES NOT EXIST
    ========================== */

    if (!storeSnapshot.exists()) {

        const defaultStore = {

            ownerId:
                user.uid,

            name:
                "LIGHTORA",

            description:
                "Discover quality products from our store.",

            phone:
                "",

            email:
                user.email || "",

            address:
                "",

            banner:
                "../images/perfume.jpg",

            createdAt:
                serverTimestamp(),

            updatedAt:
                serverTimestamp()

        };


        await setDoc(
            storeReference,
            defaultStore
        );


        console.log(
            "Default store created:",
            user.uid
        );


        return {

            id:
                user.uid,

            ownerId:
                user.uid,

            name:
                defaultStore.name,

            description:
                defaultStore.description,

            phone:
                defaultStore.phone,

            email:
                defaultStore.email,

            address:
                defaultStore.address,

            banner:
                defaultStore.banner

        };

    }


    return {

        id:
            storeSnapshot.id,

        ...storeSnapshot.data()

    };

}


/* =========================
   GET STORE BY ID
========================= */

export async function getStoreById(
    storeId
) {

    if (!storeId) {

        throw new Error(
            "Store ID is required."
        );

    }


    const storeReference =
        doc(
            db,
            "stores",
            storeId
        );


    const storeSnapshot =
        await getDoc(
            storeReference
        );


    if (!storeSnapshot.exists()) {

        return null;

    }


    return {

        id:
            storeSnapshot.id,

        ...storeSnapshot.data()

    };

}


/* =========================
   SAVE / UPDATE STORE
========================= */

export async function saveStore(
    store
) {

    const user =
        auth.currentUser;


    if (!user) {

        throw new Error(
            "User is not logged in."
        );

    }


    const storeReference =
        doc(
            db,
            "stores",
            user.uid
        );


    await setDoc(
        storeReference,
        {

            ...store,

            ownerId:
                user.uid,

            updatedAt:
                serverTimestamp()

        },
        {
            merge:
                true
        }
    );


    return storeReference;

}