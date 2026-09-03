import {
    db,
    auth
} from "../../firebase.js";


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
    where,
    runTransaction
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

    const user =
        auth.currentUser;


    if (!user) {

        throw new Error(
            "User is not logged in."
        );

    }


    return await addDoc(
        productsCollection,
        {

            ...product,

            sellerId:
                user.uid,

            status:
                "active",

            createdAt:
                serverTimestamp()

        }
    );

}


/* =========================
   GET SELLER PRODUCTS
========================= */

export async function getProducts() {

    const user =
        auth.currentUser;


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
        document => ({

            id:
                document.id,

            ...document.data()

        })
    );

}


/* =========================
   GET STORE PRODUCTS
========================= */

export async function getStoreProducts(
    storeId
) {

    let productsQuery;


    /* =========================
       SPECIFIC STORE
    ========================= */

    if (storeId) {

        productsQuery =
            query(
                productsCollection,
                where(
                    "sellerId",
                    "==",
                    storeId
                ),
                where(
                    "status",
                    "==",
                    "active"
                )
            );

    }


    /* =========================
       ALL ACTIVE PRODUCTS
    ========================= */

    else {

        productsQuery =
            query(
                productsCollection,
                where(
                    "status",
                    "==",
                    "active"
                )
            );

    }


    const snapshot =
        await getDocs(
            productsQuery
        );


    return snapshot.docs.map(
        document => ({

            id:
                document.id,

            ...document.data()

        })
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

        id:
            snapshot.id,

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

    const productRef =
        doc(
            db,
            "products",
            id
        );


    return await updateDoc(
        productRef,
        data
    );

}


/* =========================
   DELETE PRODUCT
========================= */

export async function deleteProduct(id) {

    const productRef =
        doc(
            db,
            "products",
            id
        );


    return await deleteDoc(
        productRef
    );

}


/* =========================
   DECREASE PRODUCT STOCK
========================= */

export async function decreaseProductStock(
    productId,
    quantity
) {

    const productRef =
        doc(
            db,
            "products",
            productId
        );


    return await runTransaction(
        db,
        async function (
            transaction
        ) {

            const productSnapshot =
                await transaction.get(
                    productRef
                );


            if (
                !productSnapshot.exists()
            ) {

                throw new Error(
                    "Product not found."
                );

            }


            const product =
                productSnapshot.data();


            const currentStock =
                Number(
                    product.stock || 0
                );


            const requestedQuantity =
                Number(
                    quantity || 0
                );


            if (
                requestedQuantity <= 0
            ) {

                throw new Error(
                    "Invalid quantity."
                );

            }


            if (
                requestedQuantity >
                currentStock
            ) {

                throw new Error(
                    `Maximum available quantity is ${currentStock}.`
                );

            }


            const newStock =
                currentStock -
                requestedQuantity;


            transaction.update(
                productRef,
                {

                    stock:
                        newStock

                }
            );

        }
    );

}