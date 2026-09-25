import {
    getOrder,
    updateOrderStatus,
    deleteOrder
} from "./services/orderService.js";

import {
    auth,
    onAuthStateChanged
} from "../firebase.js";


/* =====================================================
   ORDER ID
===================================================== */

const params =
    new URLSearchParams(
        window.location.search
    );

const orderId =
    params.get("id");


/* =====================================================
   ELEMENTS
===================================================== */

const orderIdElement =
    document.getElementById("orderId");

const orderStatus =
    document.getElementById("orderStatus");

const orderDate =
    document.getElementById("orderDate");

const orderTotal =
    document.getElementById("orderTotal");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");

const customerWilaya =
    document.getElementById("customerWilaya");

const customerAddress =
    document.getElementById("customerAddress");

const customerNotes =
    document.getElementById("customerNotes");

const orderProducts =
    document.getElementById("orderProducts");

const backBtn =
    document.getElementById("backBtn");

const completeBtn =
    document.getElementById("completeBtn");

const deleteBtn =
    document.getElementById("deleteBtn");


/* =====================================================
   SELLER UID
===================================================== */

const SELLER_UID =
    "I7tUxQVRH5e5R0XDVQwSGXb8m6x1";


/* =====================================================
   CHECK ORDER ID
===================================================== */

if (!orderId) {

    alert(
        "No order was selected."
    );

    window.location.href =
        "orders.html";

}


/* =====================================================
   WAIT FOR FIREBASE AUTH
===================================================== */

function waitForAuth() {

    return new Promise(
        function(resolve) {

            /*
             * إذا كانت جلسة Firebase
             * موجودة بالفعل
             */
            if (auth.currentUser) {

                console.log(
                    "Auth already ready:",
                    auth.currentUser.uid
                );

                resolve(
                    auth.currentUser
                );

                return;
            }


            /*
             * إذا لم تكن جاهزة بعد،
             * ننتظر Firebase.
             */

            console.log(
                "Waiting for Firebase authentication..."
            );


            const unsubscribe =
                onAuthStateChanged(
                    auth,
                    function(user) {

                        console.log(
                            "Firebase auth state:",
                            user
                                ? user.uid
                                : "No user"
                        );


                        unsubscribe();


                        resolve(
                            user
                        );

                    }
                );

        }
    );

}


/* =====================================================
   LOAD ORDER
===================================================== */

async function loadOrder() {

    try {

        console.log(
            "================================"
        );

        console.log(
            "LOADING ORDER DETAILS"
        );

        console.log(
            "Order ID:",
            orderId
        );


        /* =================================================
           WAIT FOR AUTH
        ================================================= */

        const user =
            await waitForAuth();


        console.log(
            "Authenticated user:",
            user
                ? user.uid
                : "NONE"
        );


        /* =================================================
           CHECK LOGIN
        ================================================= */

        if (!user) {

            console.error(
                "No authenticated Firebase user."
            );


            alert(
                "Please log in first."
            );


            window.location.href =
                "login.html";


            return;

        }


        /* =================================================
           CHECK SELLER
        ================================================= */

        console.log(
            "Current UID:",
            user.uid
        );

        console.log(
            "Expected UID:",
            SELLER_UID
        );


        if (
            user.uid !==
            SELLER_UID
        ) {

            console.error(
                "Seller UID mismatch."
            );


            alert(
                "You are not authorized to view this order."
            );


            window.location.href =
                "orders.html";


            return;

        }


        /* =================================================
           GET ORDER
        ================================================= */

        console.log(
            "Calling getOrder..."
        );


        const order =
            await getOrder(
                orderId
            );


        console.log(
            "Order returned:",
            order
        );


        /* =================================================
           ORDER NOT FOUND
        ================================================= */

        if (!order) {

            alert(
                "Order not found."
            );


            window.location.href =
                "orders.html";


            return;

        }


        /* =================================================
           ORDER INFORMATION
        ================================================= */

        if (orderIdElement) {

            orderIdElement.textContent =
                "#" + order.id;

        }


        if (orderStatus) {

            orderStatus.textContent =
                order.status ||
                "Pending";

        }


        if (orderTotal) {

            orderTotal.textContent =
                formatPrice(
                    order.total
                );

        }


        if (orderDate) {

            orderDate.textContent =
                formatDate(
                    order.createdAt
                );

        }


        /* =================================================
           CUSTOMER INFORMATION
        ================================================= */

        if (customerName) {

            customerName.textContent =
                order.customerName ||
                "-";

        }


        if (customerPhone) {

            customerPhone.textContent =
                order.phone ||
                "-";

        }


        if (customerWilaya) {

            customerWilaya.textContent =
                order.wilaya ||
                "-";

        }


        if (customerAddress) {

            customerAddress.textContent =
                order.address ||
                "-";

        }


        if (customerNotes) {

            customerNotes.textContent =
                order.notes ||
                "No notes";

        }


        /* =================================================
           PRODUCTS
        ================================================= */

        renderProducts(
            order.products || []
        );


        /* =================================================
           STATUS
        ================================================= */

        if (
            order.status ===
            "Completed"
        ) {

            if (completeBtn) {

                completeBtn.disabled =
                    true;

                completeBtn.textContent =
                    "✓ Order Completed";

            }

        }


        console.log(
            "Order details loaded successfully."
        );

    }

    catch (error) {

        console.error(
            "================================"
        );

        console.error(
            "ERROR LOADING ORDER:"
        );

        console.error(
            error
        );

        console.error(
            "================================"
        );


        alert(
            "Could not load order details."
        );

    }

}


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts(
    products
) {

    if (!orderProducts) {

        return;

    }


    if (
        !products ||
        products.length === 0
    ) {

        orderProducts.innerHTML = `

            <p>
                No products found in this order.
            </p>

        `;

        return;

    }


    orderProducts.innerHTML =
        "";


    products.forEach(
        function(product) {

            const productElement =
                document.createElement(
                    "div"
                );


            productElement.className =
                "order-product";


            const quantity =
                Number(
                    product.quantity || 0
                );


            const price =
                Number(
                    product.price || 0
                );


            const subtotal =
                price *
                quantity;


            productElement.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(
                            product.name ||
                            "Unnamed Product"
                        )}
                    </strong>

                    <p>
                        Quantity:
                        ${quantity}
                    </p>

                </div>

                <strong>
                    ${formatPrice(
                        subtotal
                    )}
                </strong>

            `;


            orderProducts.appendChild(
                productElement
            );

        }
    );

}


/* =====================================================
   COMPLETE ORDER
===================================================== */

if (completeBtn) {

    completeBtn.addEventListener(
        "click",
        async function() {

            const confirmed =
                confirm(
                    "Mark this order as completed?"
                );


            if (!confirmed) {

                return;

            }


            completeBtn.disabled =
                true;


            completeBtn.textContent =
                "Updating...";


            try {

                await updateOrderStatus(
                    orderId,
                    "Completed"
                );


                if (orderStatus) {

                    orderStatus.textContent =
                        "Completed";

                }


                completeBtn.textContent =
                    "✓ Order Completed";


                alert(
                    "Order marked as completed."
                );

            }

            catch (error) {

                console.error(
                    "Error completing order:",
                    error
                );


                alert(
                    "Could not update order."
                );


                completeBtn.disabled =
                    false;


                completeBtn.textContent =
                    "✓ Complete Order";

            }

        }
    );

}


/* =====================================================
   DELETE ORDER
===================================================== */

if (deleteBtn) {

    deleteBtn.addEventListener(
        "click",
        async function() {

            const confirmed =
                confirm(
                    "Are you sure you want to delete this order?"
                );


            if (!confirmed) {

                return;

            }


            deleteBtn.disabled =
                true;


            deleteBtn.textContent =
                "Deleting...";


            try {

                await deleteOrder(
                    orderId
                );


                alert(
                    "Order deleted successfully."
                );


                window.location.href =
                    "orders.html";

            }

            catch (error) {

                console.error(
                    "Error deleting order:",
                    error
                );


                alert(
                    "Could not delete order."
                );


                deleteBtn.disabled =
                    false;


                deleteBtn.textContent =
                    "🗑 Delete Order";

            }

        }
    );

}


/* =====================================================
   BACK BUTTON
===================================================== */

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function() {

            window.location.href =
                "orders.html";

        }
    );

}


/* =====================================================
   PRICE FORMAT
===================================================== */

function formatPrice(
    price
) {

    return Number(
        price || 0
    ).toLocaleString(
        "en-US"
    ) + " DA";

}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(
    timestamp
) {

    if (!timestamp) {

        return "-";

    }


    try {

        if (
            typeof timestamp.toDate ===
            "function"
        ) {

            return timestamp
                .toDate()
                .toLocaleString(
                    "en-GB"
                );

        }


        if (
            timestamp.seconds !==
            undefined
        ) {

            return new Date(
                timestamp.seconds * 1000
            ).toLocaleString(
                "en-GB"
            );

        }


        return "-";

    }

    catch (error) {

        console.error(
            "Date formatting error:",
            error
        );


        return "-";

    }

}


/* =====================================================
   HTML SAFETY
===================================================== */

function escapeHTML(
    value
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =====================================================
   START
===================================================== */

loadOrder();