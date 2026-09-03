import { db, auth } from "../../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
    getDoc,
    serverTimestamp,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* =========================
   PRODUCTS COLLECTION
========================= */

const productsCollection =
    collection(
        db,
        "products"
    );


/* =========================
   ADD PRODUCT
========================= */

export async function addProduct(product) {

    const user = auth.currentUser;

    if (!user) {
        throw new Error(
            "User is not logged in."
        );
    }

    return await addDoc(
        productsCollection,
        {
            ...product,

            sellerId: user.uid,

            status: "active",

            createdAt: serverTimestamp()
        }
    );
}


/* =========================
   GET SELLER PRODUCTS
========================= */

export async function getProducts() {

    const user = auth.currentUser;

    if (!user) {
        throw new Error(
            "User is not logged in."
        );
    }

    const productsQuery =
        query(
            productsCollection,
            where(
                "sellerId",
                "==",
                user.uid
            )
        );

    const snapshot =
        await getDocs(
            productsQuery
        );

    return snapshot.docs.map(
        function (document) {

            return {
                id: document.id,
                ...document.data()
            };

        }
    );
}


/* =========================
   GET STORE PRODUCTS
   PUBLIC
========================= */

export async function getStoreProducts() {

    const snapshot =
        await getDocs(
            productsCollection
        );

    return snapshot.docs
        .map(
            function (document) {

                return {
                    id: document.id,
                    ...document.data()
                };

            }
        )
        .filter(
            function (product) {

                return product.status === "active";

            }
        );
}


/* =========================
   GET ONE PRODUCT
========================= */

export async function getProduct(id) {

    const productRef =
        doc(
            db,
            "products",
            id
        );

    const snapshot =
        await getDoc(
            productRef
        );

    if (!snapshot.exists()) {

        return null;

    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    };
}


/* =========================
   UPDATE PRODUCT
========================= */

export async function updateProduct(
    id,
    data
) {

    const user = auth.currentUser;

    if (!user) {
        throw new Error(
            "User is not logged in."
        );
    }

    const productRef =
        doc(
            db,
            "products",
            id
        );

    const snapshot =
        await getDoc(
            productRef
        );

    if (!snapshot.exists()) {

        throw new Error(
            "Product not found."
        );

    }

    if (
        snapshot.data().sellerId !==
        user.uid
    ) {

        throw new Error(
            "You are not allowed to update this product."
        );

    }

    return await updateDoc(
        productRef,
        data
    );
}


/* =========================
   DELETE PRODUCT
========================= */

export async function deleteProduct(id) {

    const user = auth.currentUser;

    if (!user) {
        throw new Error(
            "User is not logged in."
        );
    }

    const productRef =
        doc(
            db,
            "products",
            id
        );

    const snapshot =
        await getDoc(
            productRef
        );

    if (!snapshot.exists()) {

        throw new Error(
            "Product not found."
        );

    }

    if (
        snapshot.data().sellerId !==
        user.uid
    ) {

        throw new Error(
            "You are not allowed to delete this product."
        );

    }

    return await deleteDoc(
        productRef
    );
}