import { onAuthStateChanged, auth } from "../firebase.js";
import { getOrders } from "./services/orderService.js";
import { getProducts } from "./services/productService.js";


/* =========================
   ELEMENTS
========================= */

const recentOrdersBody =
    document.getElementById("recentOrdersBody");

const productsCount =
    document.getElementById("productsCount");

const ordersCount =
    document.getElementById("ordersCount");

const revenueCount =
    document.getElementById("revenueCount");

const customersCount =
    document.getElementById("customersCount");


/* =========================
   LOAD DASHBOARD
========================= */

async function loadDashboard() {

    try {

        /* =========================
           LOAD PRODUCTS
        ========================== */

        const products =
            await getProducts();


        /* =========================
           LOAD ORDERS
        ========================== */

        const orders =
            await getOrders();


        /* =========================
           PRODUCTS COUNT
        ========================== */

        if (productsCount) {

            productsCount.textContent =
                products.length;

        }


        /* =========================
           ORDERS COUNT
        ========================== */

        if (ordersCount) {

            ordersCount.textContent =
                orders.length;

        }


        /* =========================
           REVENUE
        ========================== */

        const revenue =
            orders.reduce(
                function (total, order) {

                    return total +
                        Number(
                            order.total || 0
                        );

                },
                0
            );


        if (revenueCount) {

            revenueCount.textContent =
                formatPrice(revenue);

        }


        /* =========================
           CUSTOMERS
        ========================== */

        const customers =
            new Set(
                orders
                    .map(
                        function (order) {

                            return (
                                order.phone ||
                                order.customerName
                            );

                        }
                    )
                    .filter(Boolean)
            );


        if (customersCount) {

            customersCount.textContent =
                customers.size;

        }


        /* =========================
           RECENT ORDERS
        ========================== */

        renderRecentOrders(orders);

    }

    catch (error) {

        console.error(
            "Error loading dashboard:",
            error
        );


        if (recentOrdersBody) {

            recentOrdersBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        Unable to load dashboard data.
                    </td>
                </tr>
            `;

        }

    }

}


/* =========================
   WAIT FOR FIREBASE AUTH
========================= */

onAuthStateChanged(
    auth,
    function (user) {

        if (user) {

            console.log(
                "Dashboard user:",
                user.email
            );

            loadDashboard();

        }

        else {

            console.warn(
                "No user is logged in."
            );

            window.location.href =
                "login.html";

        }

    }
);


/* =========================
   RECENT ORDERS
========================= */

function renderRecentOrders(orders) {

    if (!recentOrdersBody) {

        return;

    }


    if (
        !orders ||
        orders.length === 0
    ) {

        recentOrdersBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No orders yet.
                </td>
            </tr>
        `;

        return;

    }


    /* =========================
       SORT BY DATE
    ========================== */

    const sortedOrders =
        [...orders].sort(
            function (a, b) {

                return (
                    getTime(b.createdAt) -
                    getTime(a.createdAt)
                );

            }
        );


    /* =========================
       LAST 5 ORDERS
    ========================== */

    const recent =
        sortedOrders.slice(0, 5);


    recentOrdersBody.innerHTML =
        recent
            .map(
                function (order) {

                    return createOrderRow(order);

                }
            )
            .join("");

}


/* =========================
   ORDER ROW
========================= */

function createOrderRow(order) {

    const orderId =
        order.id || "N/A";


    const customer =
        order.customerName ||
        order.customer ||
        "Unknown Customer";


    const products =
        Array.isArray(order.products)
            ? order.products
            : [];


    let productName =
        "No Product";


    if (products.length === 1) {

        productName =
            products[0].name ||
            "Product";

    }

    else if (products.length > 1) {

        productName =
            `${products[0].name || "Product"} + ${
                products.length - 1
            } more`;

    }


    const total =
        Number(
            order.total || 0
        );


    const status =
        order.status ||
        "Pending";


    return `
        <tr>

            <td>
                #${escapeHTML(orderId)}
            </td>

            <td>
                ${escapeHTML(customer)}
            </td>

            <td>
                ${escapeHTML(productName)}
            </td>

            <td>
                ${formatPrice(total)}
            </td>

            <td>
                <span class="status-badge">
                    ${escapeHTML(status)}
                </span>
            </td>

        </tr>
    `;

}


/* =========================
   DATE TIME
========================= */

function getTime(value) {

    if (!value) {

        return 0;

    }


    try {

        /* Firebase Timestamp */

        if (
            typeof value.toDate ===
            "function"
        ) {

            return value
                .toDate()
                .getTime();

        }


        /* Normal date */

        const date =
            new Date(value);


        const time =
            date.getTime();


        return Number.isNaN(time)
            ? 0
            : time;

    }

    catch (error) {

        return 0;

    }

}


/* =========================
   PRICE
========================= */

function formatPrice(price) {

    return Number(
        price || 0
    ).toLocaleString(
        "en-US"
    ) + " DA";

}


/* =========================
   HTML SAFETY
========================= */

function escapeHTML(value) {

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