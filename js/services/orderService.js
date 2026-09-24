import { db, auth } from "../../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ======================================================
// LIGHTORA SELLER
// ======================================================

const SELLER_UID =
    "I7tUxQVRH5e5R0XDVQwSGXb8m6x1";


// ======================================================
// SERVICE TEST
// ======================================================

console.log(
    "========== LIGHTORA ORDER SERVICE V2 =========="
);

console.log(
    "SELLER_UID:",
    SELLER_UID
);


// ======================================================
// ORDERS COLLECTION
// ======================================================

const ordersCollection =
    collection(
        db,
        "orders"
    );


// ======================================================
// CREATE ORDER
// ======================================================

export async function createOrder(order) {

    if (!order) {

        throw new Error(
            "Order data is missing."
        );

    }

    const orderData = {

        ...order,

        sellerId:
            SELLER_UID,

        sellerIds:
            [SELLER_UID],

        status:
            order.status ||
            "Pending",

        createdAt:
            serverTimestamp()

    };


    console.log(
        "Creating order:",
        orderData
    );


    const orderReference =
        await addDoc(
            ordersCollection,
            orderData
        );


    console.log(
        "Order created successfully:",
        orderReference.id
    );


    return orderReference.id;

}


// ======================================================
// GET SELLER ORDERS
// ======================================================

export async function getOrders() {

    const user =
        auth.currentUser;


    if (!user) {

        throw new Error(
            "User is not logged in."
        );

    }


    console.log(
        "========== GET ORDERS =========="
    );

    console.log(
        "Current Firebase UID:",
        user.uid
    );

    console.log(
        "Expected seller UID:",
        SELLER_UID
    );


    // ==================================================
    // CHECK SELLER
    // ==================================================

    if (
        user.uid !==
        SELLER_UID
    ) {

        console.error(
            "UID MISMATCH!"
        );

        throw new Error(
            "You are not authorized to view orders."
        );

    }


    // ==================================================
    // QUERY ORDERS
    // ==================================================

    const ordersQuery =
        query(
            ordersCollection,
            where(
                "sellerId",
                "==",
                SELLER_UID
            )
        );


    const snapshot =
        await getDocs(
            ordersQuery
        );


    console.log(
        "Orders found:",
        snapshot.size
    );


    const orders =
        snapshot.docs.map(
            function(document) {

                return {

                    id:
                        document.id,

                    ...document.data()

                };

            }
        );


    console.log(
        "Orders:",
        orders
    );


    return orders;

}


// ======================================================
// GET ONE ORDER
// ======================================================

export async function getOrder(id) {

    if (!id) {

        return null;

    }


    const user =
        auth.currentUser;


    if (!user) {

        throw new Error(
            "User is not logged in."
        );

    }


    if (
        user.uid !==
        SELLER_UID
    ) {

        throw new Error(
            "You are not authorized to view this order."
        );

    }


    const orderRef =
        doc(
            db,
            "orders",
            id
        );


    const snapshot =
        await getDoc(
            orderRef
        );


    if (
        !snapshot.exists()
    ) {

        return null;

    }


    const data =
        snapshot.data();


    if (
        data.sellerId !==
        SELLER_UID
    ) {

        throw new Error(
            "You are not authorized to view this order."
        );

    }


    return {

        id:
            snapshot.id,

        ...data

    };

}


// ======================================================
// UPDATE ORDER
// ======================================================

export async function updateOrder(
    id,
    data
) {

    if (!id) {

        throw new Error(
            "Order ID is missing."
        );

    }


    const user =
        auth.currentUser;


    if (!user) {

        throw new Error(
            "User is not logged in."
        );

    }


    if (
        user.uid !==
        SELLER_UID
    ) {

        throw new Error(
            "User is not authorized."
        );

    }


    const orderRef =
        doc(
            db,
            "orders",
            id
        );


    const snapshot =
        await getDoc(
            orderRef
        );


    if (
        !snapshot.exists()
    ) {

        throw new Error(
            "Order not found."
        );

    }


    if (
        snapshot.data().sellerId !==
        SELLER_UID
    ) {

        throw new Error(
            "You are not allowed to update this order."
        );

    }


    return await updateDoc(
        orderRef,
        data
    );

}


// ======================================================
// UPDATE ORDER STATUS
// ======================================================

export async function updateOrderStatus(
    id,
    status
) {

    if (!status) {

        throw new Error(
            "Order status is missing."
        );

    }


    return await updateOrder(
        id,
        {
            status:
                status
        }
    );

}


// ======================================================
// DELETE ORDER
// ======================================================

export async function deleteOrder(
    id
) {

    if (!id) {

        throw new Error(
            "Order ID is missing."
        );

    }


    const user =
        auth.currentUser;


    if (!user) {

        throw new Error(
            "User is not logged in."
        );

    }


    if (
        user.uid !==
        SELLER_UID
    ) {

        throw new Error(
            "User is not authorized."
        );

    }


    const orderRef =
        doc(
            db,
            "orders",
            id
        );


    const snapshot =
        await getDoc(
            orderRef
        );


    if (
        !snapshot.exists()
    ) {

        throw new Error(
            "Order not found."
        );

    }


    if (
        snapshot.data().sellerId !==
        SELLER_UID
    ) {

        throw new Error(
            "You are not allowed to delete this order."
        );

    }


    return await deleteDoc(
        orderRef
    );

}