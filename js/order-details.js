import {
    getOrder,
    updateOrderStatus,
    deleteOrder
} from "./services/orderService.js";


/* =========================
   ORDER ID
========================= */

const params =
    new URLSearchParams(
        window.location.search
    );


const orderId =
    params.get("id");


/* =========================
   ELEMENTS
========================= */

const orderIdElement =
    document.getElementById(
        "orderId"
    );


const orderStatus =
    document.getElementById(
        "orderStatus"
    );


const orderDate =
    document.getElementById(
        "orderDate"
    );


const orderTotal =
    document.getElementById(
        "orderTotal"
    );


const customerName =
    document.getElementById(
        "customerName"
    );


const customerPhone =
    document.getElementById(
        "customerPhone"
    );


const customerWilaya =
    document.getElementById(
        "customerWilaya"
    );


const customerAddress =
    document.getElementById(
        "customerAddress"
    );


const customerNotes =
    document.getElementById(
        "customerNotes"
    );


const orderProducts =
    document.getElementById(
        "orderProducts"
    );


const backBtn =
    document.getElementById(
        "backBtn"
    );


const completeBtn =
    document.getElementById(
        "completeBtn"
    );


const deleteBtn =
    document.getElementById(
        "deleteBtn"
    );


/* =========================
   CHECK ORDER ID
========================= */

if (!orderId) {

    alert(
        "No order was selected."
    );

    window.location.href =
        "orders.html";

}


/* =========================
   LOAD ORDER
========================= */

async function loadOrder() {

    try {

        const order =
            await getOrder(
                orderId
            );


        if (!order) {

            alert(
                "Order not found."
            );

            window.location.href =
                "orders.html";

            return;

        }


        /* =========================
           ORDER INFORMATION
        ========================== */

        orderIdElement.textContent =
            "#" + order.id;


        orderStatus.textContent =
            order.status ||
            "Pending";


        orderTotal.textContent =
            formatPrice(
                order.total
            );


        orderDate.textContent =
            formatDate(
                order.createdAt
            );


        /* =========================
           CUSTOMER INFORMATION
        ========================== */

        customerName.textContent =
            order.customerName ||
            "-";


        customerPhone.textContent =
            order.phone ||
            "-";


        customerWilaya.textContent =
            order.wilaya ||
            "-";


        customerAddress.textContent =
            order.address ||
            "-";


        customerNotes.textContent =
            order.notes ||
            "No notes";


        /* =========================
           PRODUCTS
        ========================== */

        renderProducts(
            order.products || []
        );


        /* =========================
           STATUS BUTTON
        ========================== */

        if (
            order.status ===
            "Completed"
        ) {

            completeBtn.disabled =
                true;

            completeBtn.textContent =
                "✓ Order Completed";

        }

    }

    catch (error) {

        console.error(
            "Error loading order:",
            error
        );


        alert(
            "Could not load order details."
        );

    }

}


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts(
    products
) {

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
        function (product) {

            const productElement =
                document.createElement(
                    "div"
                );


            productElement.className =
                "order-product";


            const subtotal =
                Number(
                    product.price || 0
                ) *
                Number(
                    product.quantity || 0
                );


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
                        ${Number(
                            product.quantity || 0
                        )}
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


/* =========================
   COMPLETE ORDER
========================= */

completeBtn.addEventListener(
    "click",
    async function () {

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


            orderStatus.textContent =
                "Completed";


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


/* =========================
   DELETE ORDER
========================= */

deleteBtn.addEventListener(
    "click",
    async function () {

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


/* =========================
   BACK
========================= */

backBtn.addEventListener(
    "click",
    function () {

        window.location.href =
            "orders.html";

    }
);


/* =========================
   PRICE FORMAT
========================= */

function formatPrice(
    price
) {

    return Number(
        price || 0
    ).toLocaleString(
        "en-US"
    ) + " DA";

}


/* =========================
   DATE FORMAT
========================= */

function formatDate(
    timestamp
) {

    if (
        !timestamp
    ) {

        return "-";

    }


    try {

        if (
            timestamp.toDate
        ) {

            return timestamp
                .toDate()
                .toLocaleString(
                    "en-GB"
                );

        }


        if (
            timestamp.seconds
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

        return "-";

    }

}


/* =========================
   HTML SAFETY
========================= */

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


/* =========================
   START
========================= */

loadOrder();