import {
    getOrders,
    updateOrder,
    deleteOrder
} from "./services/orderService.js";

import {
    auth,
    onAuthStateChanged
} from "../firebase.js";


/* =========================
   ELEMENTS
========================= */

const ordersTableBody =
    document.getElementById(
        "ordersTableBody"
    );

const searchInput =
    document.getElementById(
        "searchOrder"
    );

const statusFilter =
    document.getElementById(
        "statusFilter"
    );


/* =========================
   ORDERS DATA
========================= */

let orders = [];


/* =========================
   WAIT FOR AUTH
========================= */

function waitForAuth() {

    return new Promise(
        function(resolve) {

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


/* =========================
   LOAD ORDERS
========================= */

async function loadOrders() {

    try {

        if (ordersTableBody) {

            ordersTableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        Loading orders...
                    </td>
                </tr>
            `;

        }


        /* =========================
           WAIT FOR FIREBASE AUTH
        ========================= */

        const user =
            await waitForAuth();


        if (!user) {

            if (ordersTableBody) {

                ordersTableBody.innerHTML = `
                    <tr>
                        <td colspan="6">
                            Please log in first.
                        </td>
                    </tr>
                `;

            }

            return;

        }


        console.log(
            "Orders user:",
            user.email
        );


        /* =========================
           GET ORDERS
        ========================= */

        const allOrders =
            await getOrders();


        /* =========================
           CURRENT SELLER ORDERS
        ========================= */

        orders =
            allOrders.filter(
                function(order) {

                    return (
                        order.sellerId ===
                        user.uid
                    );

                }
            );


        renderOrders();

    }

    catch (error) {

        console.error(
            "Error loading orders:",
            error
        );


        if (ordersTableBody) {

            ordersTableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        Unable to load orders.
                    </td>
                </tr>
            `;

        }

    }

}


/* =========================
   RENDER ORDERS
========================= */

function renderOrders() {

    if (!ordersTableBody) {
        return;
    }


    const searchValue =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "All Orders";


    const filteredOrders =
        orders.filter(
            function(order) {

                const orderId =
                    String(
                        order.id || ""
                    ).toLowerCase();


                const customer =
                    String(
                        order.customerName ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    orderId.includes(
                        searchValue
                    ) ||
                    customer.includes(
                        searchValue
                    );


                const orderStatus =
                    String(
                        order.status ||
                        "Pending"
                    );


                const matchesStatus =
                    selectedStatus ===
                    "All Orders"
                        ? true
                        : orderStatus ===
                          selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    if (
        filteredOrders.length === 0
    ) {

        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No orders found.
                </td>
            </tr>
        `;

        return;

    }


    ordersTableBody.innerHTML =
        filteredOrders
            .map(
                function(order) {

                    return createOrderRow(
                        order
                    );

                }
            )
            .join("");

}


/* =========================
   CREATE ORDER ROW
========================= */

function createOrderRow(order) {

    const orderId =
        order.id || "N/A";


    const customer =
        order.customerName ||
        "Unknown Customer";


    const total =
        Number(
            order.total || 0
        );


    const status =
        order.status ||
        "Pending";


    const date =
        formatDate(
            order.createdAt
        );


    const safeStatus =
        status
            .toLowerCase()
            .replace(/\s+/g, "-");


    return `
        <tr>

            <td>
                #${escapeHtml(orderId)}
            </td>

            <td>
                ${escapeHtml(customer)}
            </td>

            <td>
                ${total.toLocaleString(
                    "en-US"
                )} DA
            </td>

            <td>

                <span
                    class="order-status status-${escapeHtml(
                        safeStatus
                    )}"
                >
                    ${escapeHtml(status)}
                </span>

            </td>

            <td>
                ${escapeHtml(date)}
            </td>

            <td>

                <button
                    class="view-order"
                    data-id="${escapeHtml(orderId)}"
                >
                    View
                </button>


                <button
                    class="complete-order"
                    data-id="${escapeHtml(orderId)}"
                >
                    Complete
                </button>


                <button
                    class="delete-order"
                    data-id="${escapeHtml(orderId)}"
                >
                    Delete
                </button>

            </td>

        </tr>
    `;

}


/* =========================
   VIEW ORDER
========================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".view-order"
            );


        if (!button) {
            return;
        }


        const id =
            button.dataset.id;


        window.location.href =
            `order-details.html?id=${encodeURIComponent(
                id
            )}`;

    }
);


/* =========================
   COMPLETE ORDER
========================= */

document.addEventListener(
    "click",
    async function(event) {

        const button =
            event.target.closest(
                ".complete-order"
            );


        if (!button) {
            return;
        }


        const id =
            button.dataset.id;


        try {

            button.disabled =
                true;

            button.textContent =
                "Updating...";


            await updateOrder(
                id,
                {
                    status:
                        "Completed"
                }
            );


            await loadOrders();

        }

        catch (error) {

            console.error(
                "Error updating order:",
                error
            );


            alert(
                "Unable to update order."
            );


            button.disabled =
                false;

            button.textContent =
                "Complete";

        }

    }
);


/* =========================
   DELETE ORDER
========================= */

document.addEventListener(
    "click",
    async function(event) {

        const button =
            event.target.closest(
                ".delete-order"
            );


        if (!button) {
            return;
        }


        const id =
            button.dataset.id;


        const confirmed =
            confirm(
                "Are you sure you want to delete this order?"
            );


        if (!confirmed) {
            return;
        }


        try {

            button.disabled =
                true;

            button.textContent =
                "Deleting...";


            await deleteOrder(
                id
            );


            await loadOrders();

        }

        catch (error) {

            console.error(
                "Error deleting order:",
                error
            );


            alert(
                "Unable to delete order."
            );


            button.disabled =
                false;

            button.textContent =
                "Delete";

        }

    }
);


/* =========================
   SEARCH
========================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderOrders
    );

}


/* =========================
   STATUS FILTER
========================= */

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        renderOrders
    );

}


/* =========================
   FORMAT DATE
========================= */

function formatDate(value) {

    if (!value) {
        return "N/A";
    }


    try {

        let date;


        if (
            typeof value.toDate ===
            "function"
        ) {

            date =
                value.toDate();

        }

        else {

            date =
                new Date(
                    value
                );

        }


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "N/A";

        }


        return date.toLocaleDateString(
            "en-GB"
        );

    }

    catch (error) {

        return "N/A";

    }

}


/* =========================
   HTML ESCAPE
========================= */

function escapeHtml(value) {

    return String(
        value
    )
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

loadOrders();