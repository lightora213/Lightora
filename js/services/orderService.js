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

// UID حساب البائع الذي يملك متجر Lightora
const SELLER_UID =
    "ozeREirMKKWr0XCC8cpHFTsgm7p2";


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


    /*
       الزبون لا يحتاج إلى تسجيل الدخول.

       كل طلبية في متجر Lightora
       مرتبطة بحساب البائع.
    */

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


    /*
       يجب أن يكون الحساب الحالي
       هو حساب بائع Lightora.
    */

    if (
        user.uid !==
        SELLER_UID
    ) {

        console.error(
            "Current Firebase UID:",
            user.uid
        );

        console.error(
            "Expected seller UID:",
            SELLER_UID
        );


        throw new Error(
            "You are not authorized to view orders."
        );

    }


    console.log(
        "Loading orders for seller:",
        SELLER_UID
    );


    /*
       جلب طلبات متجر Lightora فقط.
    */

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


    return snapshot.docs.map(
        function(document) {

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


    /*
       تأكد أن الطلبية
       تخص متجر Lightora.
    */

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


    /*
       لا تسمح بتعديل طلبية
       تخص بائعًا آخر.
    */

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


    /*
       لا تسمح بحذف طلبية
       تخص بائعًا آخر.
    */

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