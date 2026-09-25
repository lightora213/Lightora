import {
    db,
    auth,
    onAuthStateChanged
} from "../../firebase.js";

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
// SERVICE
// ======================================================

console.log(
    "========== LIGHTORA ORDER SERVICE V3 =========="
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
// WAIT FOR AUTH
// ======================================================

function waitForUser() {

    return new Promise(
        function(resolve) {

            // إذا كان المستخدم موجودًا بالفعل
            if (auth.currentUser) {

                resolve(
                    auth.currentUser
                );

                return;

            }


            // Firebase لم ينته بعد من استعادة الجلسة
            const unsubscribe =
                onAuthStateChanged(
                    auth,
                    function(user) {

                        unsubscribe();

                        resolve(user);

                    }
                );

        }
    );

}


// ======================================================
// GET AUTHORIZED SELLER
// ======================================================

async function getAuthorizedUser() {

    const user =
        await waitForUser();


    if (!user) {

        throw new Error(
            "User is not logged in."
        );

    }


    console.log(
        "Current Firebase UID:",
        user.uid
    );


    console.log(
        "Expected seller UID:",
        SELLER_UID
    );


    if (
        user.uid !==
        SELLER_UID
    ) {

        throw new Error(
            "You are not authorized to view orders."
        );

    }


    return user;

}


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
       الزبون لا يحتاج إلى حساب.

       الطلبية مرتبطة بحساب البائع
       Lightora.
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

    console.log(
        "========== GET ORDERS =========="
    );


    await getAuthorizedUser();


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


    console.log(
        "========== GET ONE ORDER =========="
    );

    console.log(
        "Order ID:",
        id
    );


    /*
       مهم جدًا:

       ننتظر Firebase Auth قبل قراءة
       auth.currentUser.
    */

    await getAuthorizedUser();


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

        console.log(
            "Order does not exist."
        );

        return null;

    }


    const data =
        snapshot.data();


    console.log(
        "Order data:",
        data
    );


    /*
       التأكد أن الطلبية تخص Lightora.
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


    await getAuthorizedUser();


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

export async function deleteOrder(id) {

    if (!id) {

        throw new Error(
            "Order ID is missing."
        );

    }


    await getAuthorizedUser();


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