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
// LIGHTORA STORE
// ======================================================

const LIGHTORA_STORE_ID =
    "ozeREirMKKWr0XCC8cpHFTsgm7p2";

const SELLER_UID =
    "I7tUxQVRH5e5R0XDVQwSGXb8m6x1";


// ======================================================
// COLLECTION
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

    const orderData = {

        ...order,

        sellerId:
            LIGHTORA_STORE_ID,

        sellerIds:
            Array.isArray(order.sellerIds)
                ? order.sellerIds
                : [LIGHTORA_STORE_ID],

        status:
            order.status ||
            "Pending",

        createdAt:
            serverTimestamp()

    };


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


    // تأكد أن الحساب هو حساب Lightora
    if (
        user.uid !==
        SELLER_UID
    ) {

        throw new Error(
            "You are not authorized to view orders."
        );

    }


    // مهم:
    // الطلبات محفوظة بـ sellerId الخاص بالمتجر
    // وليس UID الخاص بحساب Firebase

    const ordersQuery =
        query(
            ordersCollection,
            where(
                "sellerId",
                "==",
                LIGHTORA_STORE_ID
            )
        );


    const snapshot =
        await getDocs(
            ordersQuery
        );


    return snapshot.docs.map(
        function (document) {

            return {

                id:
                    document.id,

                ...document.data()

            };

        }
    );

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


    if (
        !user ||
        user.uid !== SELLER_UID
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
        LIGHTORA_STORE_ID
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


    if (
        !user ||
        user.uid !== SELLER_UID
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
        LIGHTORA_STORE_ID
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


    if (
        !user ||
        user.uid !== SELLER_UID
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
        LIGHTORA_STORE_ID
    ) {

        throw new Error(
            "You are not allowed to delete this order."
        );

    }


    return await deleteDoc(
        orderRef
    );

}