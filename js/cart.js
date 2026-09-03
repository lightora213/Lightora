import { getProduct } from "./services/productService.js";


/* =========================
   CART
========================= */

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


/* =========================
   ELEMENTS
========================= */

const cartContainer =
    document.getElementById(
        "cartContainer"
    );


const cartTotal =
    document.getElementById(
        "cartTotal"
    );


const cartCount =
    document.getElementById(
        "cartCount"
    );


const checkoutBtn =
    document.getElementById(
        "checkoutBtn"
    );


/* =========================
   LOAD CURRENT STOCK
========================= */

async function syncCartWithStock() {

    const updatedCart = [];


    for (const item of cart) {

        try {

            const product =
                await getProduct(
                    item.id
                );


            /*
                PRODUCT WAS DELETED
            */

            if (!product) {

                continue;

            }


            const stock =
                Number(
                    product.stock || 0
                );
                item.stock = stock;


            /*
                PRODUCT OUT OF STOCK
            */

            if (stock <= 0) {

                continue;

            }


            /*
                UPDATE PRODUCT DATA
            */

            item.name =
                product.name ||
                item.name;


            item.price =
                Number(
                    product.price || 0
                );


            item.image =
                product.image ||
                item.image ||
                "../images/perfume.jpg";


            /*
                IMPORTANT

                If cart quantity is
                greater than current stock,
                automatically reduce it.
            */

            if (
                Number(item.quantity) >
                stock
            ) {

                item.quantity =
                    stock;

            }


            /*
                Make sure quantity
                is at least 1
            */

            if (
                Number(item.quantity) < 1
            ) {

                item.quantity = 1;

            }


            updatedCart.push(
                item
            );

        }

        catch (error) {

            console.error(
                "Could not check product stock:",
                error
            );


            /*
                Keep item temporarily
                if Firebase check fails.
            */

            updatedCart.push(
                item
            );

        }

    }


    cart =
        updatedCart;


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


/* =========================
   RENDER CART
========================= */

async function renderCart() {

    cartContainer.innerHTML = "";


    /*
        EMPTY CART
    */

    if (cart.length === 0) {

        showEmptyCart();

        return;

    }


    /*
        CHECK CURRENT STOCK
        FROM FIREBASE
    */

    cartContainer.innerHTML = `

        <div class="empty-cart">

            <p>
                Checking product availability...
            </p>

        </div>

    `;


    await syncCartWithStock();


    /*
        CART MAY BECOME EMPTY
        AFTER STOCK CHECK
    */

    if (cart.length === 0) {

        showEmptyCart();

        return;

    }


    checkoutBtn.disabled =
        false;


    /*
        RENDER PRODUCTS
    */

    cart.forEach(
        function (item, index) {

            const stock =
                Number(
                    item.stock || 0
                );


            const quantity =
                Number(
                    item.quantity || 1
                );


            const subtotal =
                Number(
                    item.price || 0
                ) *
                quantity;


            const itemElement =
                document.createElement(
                    "div"
                );


            itemElement.className =
                "cart-item";


            itemElement.innerHTML = `

                <div class="cart-item-image">

                    <img
                        src="${escapeHTML(
                            item.image ||
                            "../images/perfume.jpg"
                        )}"
                        alt="${escapeHTML(
                            item.name ||
                            "Product"
                        )}">

                </div>


                <div class="cart-item-info">

                    <h3>
                        ${escapeHTML(
                            item.name ||
                            "Product"
                        )}
                    </h3>

                    <p>
                        ${formatPrice(
                            item.price
                        )}
                    </p>

                </div>


                <div class="cart-quantity">

                    <button
                        class="decrease"
                        data-index="${index}">

                        −

                    </button>


                    <span>
                        ${quantity}
                    </span>


                    <button
                        class="increase"
                        data-index="${index}">

                        +

                    </button>

                </div>


                <div class="cart-subtotal">

                    ${formatPrice(
                        subtotal
                    )}

                </div>


                <button
                    class="remove-item"
                    data-index="${index}">

                    🗑 Remove

                </button>


                <small
                    class="cart-stock-message">

                    Maximum available:
                    ${stock}

                </small>

            `;


            cartContainer.appendChild(
                itemElement
            );

        }
    );


    updateTotal();

    updateCartCount();

    attachCartEvents();

}


/* =========================
   EMPTY CART
========================= */

function showEmptyCart() {

    cartContainer.innerHTML = `

        <div class="empty-cart">

            <h2>
                Your cart is empty
            </h2>

            <p>
                Add some products before checkout.
            </p>

            <a
                href="store.html">

                Start Shopping

            </a>

        </div>

    `;


    cartTotal.textContent =
        "0 DA";


    checkoutBtn.disabled =
        true;


    updateCartCount();

}


/* =========================
   EVENTS
========================= */

function attachCartEvents() {


    /* =========================
       DECREASE
    ========================== */

    document
        .querySelectorAll(".decrease")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        if (
                            cart[index].quantity >
                            1
                        ) {

                            cart[index].quantity--;

                        }


                        saveCart();

                    }
                );

            }
        );


    /* =========================
       INCREASE
    ========================== */

    document
        .querySelectorAll(".increase")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    async function () {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        const item =
                            cart[index];


                        try {

                            /*
                                GET CURRENT
                                PRODUCT STOCK
                            */

                            const product =
                                await getProduct(
                                    item.id
                                );


                            if (!product) {

                                alert(
                                    "This product is no longer available."
                                );

                                cart.splice(
                                    index,
                                    1
                                );


                                saveCart();

                                return;

                            }


                            const stock =
                                Number(
                                    product.stock || 0
                                );


                            /*
                                CURRENT QUANTITY
                            */

                            const quantity =
                                Number(
                                    item.quantity || 1
                                );


                            /*
                                DO NOT EXCEED STOCK
                            */

                            if (
                                quantity >= stock
                            ) {

                                item.quantity =
                                    stock;


                                saveCart();

                                return;

                            }


                            /*
                                INCREASE
                            */

                            item.quantity =
                                quantity + 1;


                            saveCart();

                        }

                        catch (error) {

                            console.error(
                                "Error checking stock:",
                                error
                            );


                            alert(
                                "Could not check product availability."
                            );

                        }

                    }
                );

            }
        );


    /* =========================
       REMOVE
    ========================== */

    document
        .querySelectorAll(".remove-item")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        cart.splice(
                            index,
                            1
                        );


                        saveCart();

                    }
                );

            }
        );

}


/* =========================
   TOTAL
========================= */

function updateTotal() {

    const total =
        cart.reduce(
            function (
                sum,
                item
            ) {

                return sum +
                    (
                        Number(
                            item.price || 0
                        ) *
                        Number(
                            item.quantity || 0
                        )
                    );

            },
            0
        );


    cartTotal.textContent =
        formatPrice(total);

}


/* =========================
   CART COUNT
========================= */

function updateCartCount() {

    const count =
        cart.reduce(
            function (
                total,
                item
            ) {

                return total +
                    Number(
                        item.quantity || 0
                    );

            },
            0
        );


    if (cartCount) {

        cartCount.textContent =
            count;

    }

}


/* =========================
   SAVE CART
========================= */

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    renderCart();

}


/* =========================
   CHECKOUT
========================= */

checkoutBtn.addEventListener(
    "click",
    function () {

        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;

        }


        window.location.href =
            "checkout.html";

    }
);


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


/* =========================
   START
========================= */

renderCart();