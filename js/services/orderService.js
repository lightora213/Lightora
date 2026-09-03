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


/* =========================================================
   COLLECTION
========================================================= */

const ordersCollection =
    collection(
        db,
        "orders"
    );


/* =========================================================
   CREATE ORDER
========================================================= */

export async function createOrder(order) {

    const orderData = {

        ...order,

        sellerId:
            order.sellerId ||
            null,

        sellerIds:
            Array.isArray(order.sellerIds)
                ? order.sellerIds
                : [],

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


    return orderReference;

}


/* =========================================================
   GET SELLER ORDERS
========================================================= */

export async function getOrders() {

    const user =
        auth.currentUser;


    if (!user) {

        throw new Error(
            "User is not logged in."
        );

    }


    const ordersQuery =
        query(
            ordersCollection,
            where(
                "sellerId",
                "==",
                user.uid
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


/* =========================================================
   GET ONE ORDER
========================================================= */

export async function getOrder(id) {

    if (!id) {

        return null;

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


    return {

        id:
            snapshot.id,

        ...snapshot.data()

    };

}


/* =========================================================
   UPDATE ORDER
========================================================= */

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
        user.uid
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


/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

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
            status: status
        }
    );

}


/* =========================================================
   DELETE ORDER
========================================================= */

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
        user.uid
    ) {

        throw new Error(
            "You are not allowed to delete this order."
        );

    }


    return await deleteDoc(
        orderRef
    );

}