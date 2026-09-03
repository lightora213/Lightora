import {
    createOrder
} from "./services/orderService.js";

import {
    getProduct
} from "./services/productService.js";


/* =========================================================
   CHECKOUT MODE
========================================================= */

const params =
    new URLSearchParams(
        window.location.search
    );

const isBuyNow =
    params.get("buyNow") === "true";


/* =========================================================
   CART
========================================================= */

let cart =
    loadCart();


/* =========================================================
   BUY NOW PRODUCT
========================================================= */

let buyNowProduct =
    loadBuyNowProduct();


/* =========================================================
   CHECKOUT QUANTITIES
========================================================= */

let checkoutQuantities = {};


/* =========================================================
   ELEMENTS
========================================================= */

const checkoutForm =
    document.getElementById(
        "checkoutForm"
    );

const customerName =
    document.getElementById(
        "customerName"
    );

const phone =
    document.getElementById(
        "phone"
    );

const wilaya =
    document.getElementById(
        "wilaya"
    );

const address =
    document.getElementById(
        "address"
    );

const notes =
    document.getElementById(
        "notes"
    );

const checkoutItems =
    document.getElementById(
        "checkoutItems"
    );

const checkoutTotal =
    document.getElementById(
        "checkoutTotal"
    );

const placeOrderBtn =
    document.getElementById(
        "placeOrderBtn"
    );

const checkoutMessage =
    document.getElementById(
        "checkoutMessage"
    );

const cartCount =
    document.getElementById(
        "cartCount"
    );


/* =========================================================
   INITIALIZE
========================================================= */

initializeCheckout();


function initializeCheckout() {

    /*
     * Buy Now
     */

    if (
        isBuyNow &&
        buyNowProduct &&
        buyNowProduct.id
    ) {

        checkoutQuantities = {

            [buyNowProduct.id]:
                Number(
                    buyNowProduct.quantity || 1
                )

        };

        updateCartCount();

        renderBuyNow();

        return;
    }


    /*
     * Normal Cart Checkout
     */

    initializeCheckoutQuantities();

    updateCartCount();

    renderCheckout();

}


/* =========================================================
   LOAD CART
========================================================= */

function loadCart() {

    try {

        const savedCart =
            localStorage.getItem(
                "cart"
            );


        if (!savedCart) {

            return [];

        }


        const parsedCart =
            JSON.parse(
                savedCart
            );


        if (
            !Array.isArray(
                parsedCart
            )
        ) {

            return [];

        }


        return parsedCart

            .filter(function(item) {

                return (
                    item &&
                    item.id
                );

            })

            .map(function(item) {

                let quantity =
                    Number(
                        item.quantity
                    );


                if (
                    !Number.isFinite(
                        quantity
                    ) ||
                    quantity < 1
                ) {

                    quantity = 1;

                }


                return {

                    ...item,

                    price:
                        Number(
                            item.price || 0
                        ),

                    quantity:
                        Math.floor(
                            quantity
                        )

                };

            });

    }

    catch (error) {

        console.error(
            "Could not load cart:",
            error
        );

        return [];

    }

}


/* =========================================================
   LOAD BUY NOW PRODUCT
========================================================= */

function loadBuyNowProduct() {

    try {

        const savedProduct =
            localStorage.getItem(
                "buyNowProduct"
            );


        if (!savedProduct) {

            return null;

        }


        const product =
            JSON.parse(
                savedProduct
            );


        if (
            !product ||
            !product.id
        ) {

            return null;

        }


        return {

            ...product,

            price:
                Number(
                    product.price || 0
                ),

            quantity:
                Math.max(
                    1,
                    Math.floor(
                        Number(
                            product.quantity || 1
                        )
                    )
                )

        };

    }

    catch (error) {

        console.error(
            "Could not load Buy Now product:",
            error
        );

        return null;

    }

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(
            cart
        )
    );

}


/* =========================================================
   INITIALIZE CHECKOUT QUANTITIES
========================================================= */

function initializeCheckoutQuantities() {

    checkoutQuantities = {};


    cart.forEach(function(item) {

        checkoutQuantities[
            item.id
        ] =
            Number(
                item.quantity || 1
            );

    });

}


/* =========================================================
   GET CHECKOUT QUANTITY
========================================================= */

function getCheckoutQuantity(item) {

    const quantity =
        Number(
            checkoutQuantities[
                item.id
            ]
        );


    if (
        !Number.isFinite(
            quantity
        ) ||
        quantity < 1
    ) {

        return 1;

    }


    return Math.floor(
        quantity
    );

}


/* =========================================================
   RENDER BUY NOW
========================================================= */

function renderBuyNow() {

    if (!checkoutItems) {

        return;

    }


    checkoutItems.innerHTML = "";


    if (
        !buyNowProduct
    ) {

        showMessage(
            "The selected product could not be loaded.",
            "error"
        );

        if (placeOrderBtn) {

            placeOrderBtn.disabled =
                true;

        }

        return;

    }


    const quantity =
        Math.max(
            1,
            Number(
                buyNowProduct.quantity || 1
            )
        );


    const price =
        Number(
            buyNowProduct.price || 0
        );


    const subtotal =
        price *
        quantity;


    const itemElement =
        document.createElement(
            "div"
        );


    itemElement.className =
        "checkout-item";


    itemElement.innerHTML = `

        <div class="checkout-product">

            <div class="checkout-product-image">

                <img
                    src="${escapeHTML(
                        buyNowProduct.image ||
                        "../images/perfume.jpg"
                    )}"
                    alt="${escapeHTML(
                        buyNowProduct.name ||
                        "Product"
                    )}">

            </div>


            <div class="checkout-product-info">

                <h3>
                    ${escapeHTML(
                        buyNowProduct.name ||
                        "Product"
                    )}
                </h3>


                <p>
                    ${formatPrice(price)}
                </p>


                <small>
                    Quantity:
                    ${quantity}
                </small>

            </div>

        </div>


        <div class="checkout-quantity">

            <button
                type="button"
                class="checkout-decrease"
                data-id="${escapeHTML(
                    buyNowProduct.id
                )}">

                −

            </button>


            <input
                type="number"
                class="checkout-quantity-input"
                data-id="${escapeHTML(
                    buyNowProduct.id
                )}"
                value="${quantity}"
                min="1"
                max="${Number(
                    buyNowProduct.stock || quantity
                )}">


            <button
                type="button"
                class="checkout-increase"
                data-id="${escapeHTML(
                    buyNowProduct.id
                )}">

                +

            </button>

        </div>


        <div class="checkout-subtotal">

            ${formatPrice(
                subtotal
            )}

        </div>

    `;


    checkoutItems.appendChild(
        itemElement
    );


    if (placeOrderBtn) {

        placeOrderBtn.disabled =
            false;

    }


    updateBuyNowTotal();

    attachBuyNowQuantityEvents();

}


/* =========================================================
   BUY NOW QUANTITY EVENTS
========================================================= */

function attachBuyNowQuantityEvents() {

    const decreaseButton =
        document.querySelector(
            ".checkout-decrease"
        );

    const increaseButton =
        document.querySelector(
            ".checkout-increase"
        );

    const input =
        document.querySelector(
            ".checkout-quantity-input"
        );


    if (!input) {

        return;

    }


    if (decreaseButton) {

        decreaseButton.addEventListener(
            "click",
            function() {

                let quantity =
                    Number(
                        input.value
                    ) || 1;


                if (
                    quantity > 1
                ) {

                    quantity--;

                }


                setBuyNowQuantity(
                    quantity
                );

            }
        );

    }


    if (increaseButton) {

        increaseButton.addEventListener(
            "click",
            async function() {

                if (
                    !buyNowProduct
                ) {

                    return;

                }


                let quantity =
                    Number(
                        input.value
                    ) || 1;


                const maxStock =
                    await getCurrentStock(
                        buyNowProduct.id
                    );


                if (
                    maxStock <= 0
                ) {

                    showMessage(
                        "This product is out of stock.",
                        "error"
                    );

                    return;

                }


                if (
                    quantity < maxStock
                ) {

                    quantity++;

                }


                setBuyNowQuantity(
                    quantity
                );

            }
        );

    }


    input.addEventListener(
        "change",
        async function() {

            if (
                !buyNowProduct
            ) {

                return;

            }


            let quantity =
                Number(
                    input.value
                );


            if (
                !Number.isFinite(
                    quantity
                ) ||
                quantity < 1
            ) {

                quantity = 1;

            }


            quantity =
                Math.floor(
                    quantity
                );


            const maxStock =
                await getCurrentStock(
                    buyNowProduct.id
                );


            if (
                maxStock > 0 &&
                quantity > maxStock
            ) {

                quantity =
                    maxStock;

            }


            setBuyNowQuantity(
                quantity
            );

        }
    );

}


/* =========================================================
   SET BUY NOW QUANTITY
========================================================= */

function setBuyNowQuantity(
    quantity
) {

    if (
        !buyNowProduct
    ) {

        return;

    }


    quantity =
        Math.max(
            1,
            Math.floor(
                Number(
                    quantity || 1
                )
            )
        );


    buyNowProduct.quantity =
        quantity;


    checkoutQuantities[
        buyNowProduct.id
    ] =
        quantity;


    renderBuyNow();

}


/* =========================================================
   GET CURRENT STOCK
========================================================= */

async function getCurrentStock(
    productId
) {

    try {

        const product =
            await getProduct(
                productId
            );


        if (!product) {

            return 0;

        }


        return Number(
            product.stock || 0
        );

    }

    catch (error) {

        console.error(
            "Could not check stock:",
            error
        );

        return 0;

    }

}


/* =========================================================
   UPDATE BUY NOW TOTAL
========================================================= */

function updateBuyNowTotal() {

    if (
        !checkoutTotal ||
        !buyNowProduct
    ) {

        return;

    }


    const quantity =
        Number(
            buyNowProduct.quantity || 1
        );


    const price =
        Number(
            buyNowProduct.price || 0
        );


    checkoutTotal.textContent =
        formatPrice(
            price * quantity
        );

}


/* =========================================================
   RENDER CART CHECKOUT
========================================================= */

function renderCheckout() {

    if (!checkoutItems) {

        console.error(
            "checkoutItems element was not found."
        );

        return;

    }


    checkoutItems.innerHTML = "";


    if (
        cart.length === 0
    ) {

        checkoutItems.innerHTML = `

            <div class="empty-checkout">

                <h3>
                    Your cart is empty.
                </h3>

                <p>
                    Please add products before checkout.
                </p>

                <a href="store.html">
                    Return to Store
                </a>

            </div>

        `;


        if (checkoutTotal) {

            checkoutTotal.textContent =
                "0 DA";

        }


        if (placeOrderBtn) {

            placeOrderBtn.disabled =
                true;

        }


        updateCartCount();

        return;

    }


    cart.forEach(function(item) {

        const price =
            Number(
                item.price || 0
            );


        const cartQuantity =
            Number(
                item.quantity || 1
            );


        let checkoutQuantity =
            getCheckoutQuantity(
                item
            );


        if (
            checkoutQuantity >
            cartQuantity
        ) {

            checkoutQuantity =
                cartQuantity;

            checkoutQuantities[
                item.id
            ] =
                cartQuantity;

        }


        const subtotal =
            price *
            checkoutQuantity;


        const itemElement =
            document.createElement(
                "div"
            );


        itemElement.className =
            "checkout-item";


        itemElement.innerHTML = `

            <div class="checkout-product">

                <div class="checkout-product-image">

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


                <div class="checkout-product-info">

                    <h3>
                        ${escapeHTML(
                            item.name ||
                            "Product"
                        )}
                    </h3>


                    <p>
                        ${formatPrice(
                            price
                        )}
                    </p>


                    <small>
                        Quantity in cart:
                        ${cartQuantity}
                    </small>

                </div>

            </div>


            <div class="checkout-quantity">

                <button
                    type="button"
                    class="checkout-decrease"
                    data-id="${escapeHTML(
                        item.id
                    )}">

                    −

                </button>


                <input
                    type="number"
                    class="checkout-quantity-input"
                    data-id="${escapeHTML(
                        item.id
                    )}"
                    value="${checkoutQuantity}"
                    min="1"
                    max="${cartQuantity}">


                <button
                    type="button"
                    class="checkout-increase"
                    data-id="${escapeHTML(
                        item.id
                    )}">

                    +

                </button>

            </div>


            <div class="checkout-subtotal">

                ${formatPrice(
                    subtotal
                )}

            </div>

        `;


        checkoutItems.appendChild(
            itemElement
        );

    });


    if (placeOrderBtn) {

        placeOrderBtn.disabled =
            false;

    }


    updateCheckoutTotal();

    updateCartCount();

    attachCheckoutQuantityEvents();

}


/* =========================================================
   CART QUANTITY EVENTS
========================================================= */

function attachCheckoutQuantityEvents() {

    document
        .querySelectorAll(
            ".checkout-decrease"
        )
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const productId =
                        button.dataset.id;


                    const item =
                        cart.find(
                            function(cartItem) {

                                return (
                                    String(
                                        cartItem.id
                                    ) ===
                                    String(
                                        productId
                                    )
                                );

                            }
                        );


                    if (!item) {

                        return;

                    }


                    let quantity =
                        getCheckoutQuantity(
                            item
                        );


                    if (
                        quantity > 1
                    ) {

                        quantity--;

                    }


                    checkoutQuantities[
                        item.id
                    ] =
                        quantity;


                    renderCheckout();

                }
            );

        });


    document
        .querySelectorAll(
            ".checkout-increase"
        )
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const productId =
                        button.dataset.id;


                    const item =
                        cart.find(
                            function(cartItem) {

                                return (
                                    String(
                                        cartItem.id
                                    ) ===
                                    String(
                                        productId
                                    )
                                );

                            }
                        );


                    if (!item) {

                        return;

                    }


                    const cartQuantity =
                        Number(
                            item.quantity || 1
                        );


                    let quantity =
                        getCheckoutQuantity(
                            item
                        );


                    if (
                        quantity <
                        cartQuantity
                    ) {

                        quantity++;

                    }


                    checkoutQuantities[
                        item.id
                    ] =
                        quantity;


                    renderCheckout();

                }
            );

        });


    document
        .querySelectorAll(
            ".checkout-quantity-input"
        )
        .forEach(function(input) {

            input.addEventListener(
                "change",
                function() {

                    const productId =
                        input.dataset.id;


                    const item =
                        cart.find(
                            function(cartItem) {

                                return (
                                    String(
                                        cartItem.id
                                    ) ===
                                    String(
                                        productId
                                    )
                                );

                            }
                        );


                    if (!item) {

                        return;

                    }


                    const cartQuantity =
                        Number(
                            item.quantity || 1
                        );


                    let quantity =
                        Number(
                            input.value
                        );


                    if (
                        !Number.isFinite(
                            quantity
                        )
                    ) {

                        quantity = 1;

                    }


                    quantity =
                        Math.floor(
                            quantity
                        );


                    if (
                        quantity < 1
                    ) {

                        quantity = 1;

                    }


                    if (
                        quantity >
                        cartQuantity
                    ) {

                        quantity =
                            cartQuantity;

                    }


                    checkoutQuantities[
                        item.id
                    ] =
                        quantity;


                    renderCheckout();

                }
            );

        });

}


/* =========================================================
   CHECKOUT TOTAL
========================================================= */

function updateCheckoutTotal() {

    if (!checkoutTotal) {

        return;

    }


    const total =
        cart.reduce(
            function(sum,item) {

                const quantity =
                    getCheckoutQuantity(
                        item
                    );


                return (
                    sum +
                    Number(
                        item.price || 0
                    ) *
                    quantity
                );

            },
            0
        );


    checkoutTotal.textContent =
        formatPrice(
            total
        );

}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

    if (!cartCount) {

        return;

    }


    const count =
        cart.reduce(
            function(total,item) {

                return (
                    total +
                    Number(
                        item.quantity || 0
                    )
                );

            },
            0
        );


    cartCount.textContent =
        count;

}


/* =========================================================
   SUBMIT ORDER
========================================================= */

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            /* =================================================
               CUSTOMER DATA
            ================================================= */

            const name =
                customerName
                    ? customerName.value.trim()
                    : "";


            const customerPhone =
                phone
                    ? phone.value.trim()
                    : "";


            const customerWilaya =
                wilaya
                    ? wilaya.value.trim()
                    : "";


            const customerAddress =
                address
                    ? address.value.trim()
                    : "";


            const customerNotes =
                notes
                    ? notes.value.trim()
                    : "";


            /* =================================================
               VALIDATION
            ================================================= */

            if (
                !name ||
                !customerPhone ||
                !customerWilaya ||
                !customerAddress
            ) {

                showMessage(
                    "Please complete all required fields.",
                    "error"
                );

                return;

            }


            if (placeOrderBtn) {

                placeOrderBtn.disabled =
                    true;

                placeOrderBtn.textContent =
                    "Checking availability...";

            }


            try {

                /* =================================================
                   PREPARE SOURCE
                ================================================= */

                let sourceItems = [];


                if (
                    isBuyNow
                ) {

                    if (
                        !buyNowProduct ||
                        !buyNowProduct.id
                    ) {

                        throw new Error(
                            "The selected product could not be loaded."
                        );

                    }


                    sourceItems = [
                        buyNowProduct
                    ];

                }

                else {

                    cart =
                        loadCart();


                    if (
                        cart.length === 0
                    ) {

                        throw new Error(
                            "Your cart is empty."
                        );

                    }


                    sourceItems =
                        cart;

                }


                /* =================================================
                   BUILD ORDER ITEMS
                ================================================= */

                const orderItems = [];


                for (
                    const item of sourceItems
                ) {

                    const product =
                        await getProduct(
                            item.id
                        );


                    if (!product) {

                        throw new Error(
                            `${item.name || "A product"} is no longer available.`
                        );

                    }


                    const stock =
                        Number(
                            product.stock || 0
                        );


                    let requestedQuantity;


                    if (
                        isBuyNow
                    ) {

                        requestedQuantity =
                            Number(
                                buyNowProduct.quantity || 1
                            );

                    }

                    else {

                        requestedQuantity =
                            Number(
                                checkoutQuantities[
                                    item.id
                                ]
                            );

                    }


                    if (
                        !Number.isFinite(
                            requestedQuantity
                        ) ||
                        requestedQuantity < 1
                    ) {

                        requestedQuantity = 1;

                    }


                    requestedQuantity =
                        Math.floor(
                            requestedQuantity
                        );


                    /* =================================================
                       CART LIMIT
                    ================================================= */

                    if (
                        !isBuyNow
                    ) {

                        const cartQuantity =
                            Number(
                                item.quantity || 0
                            );


                        if (
                            requestedQuantity >
                            cartQuantity
                        ) {

                            requestedQuantity =
                                cartQuantity;

                        }

                    }


                    /* =================================================
                       REAL STOCK CHECK
                    ================================================= */

                    if (
                        stock <= 0
                    ) {

                        throw new Error(
                            `${product.name || item.name} is out of stock.`
                        );

                    }


                    if (
                        requestedQuantity >
                        stock
                    ) {

                        throw new Error(
                            `Only ${stock} unit(s) of ${product.name || item.name} are available.`
                        );

                    }


                    orderItems.push({

                        productId:
                            product.id,

                        name:
                            product.name ||
                            item.name ||
                            "",

                        price:
                            Number(
                                product.price ??
                                item.price ??
                                0
                            ),

                        quantity:
                            requestedQuantity,

                        image:
                            product.image ||
                            item.image ||
                            "",

                        sellerId:
                            product.sellerId ||
                            item.sellerId ||
                            null

                    });

                }


                if (
                    orderItems.length === 0
                ) {

                    throw new Error(
                        "There are no valid products in your order."
                    );

                }


                /* =================================================
                   TOTAL
                ================================================= */

                const total =
                    orderItems.reduce(
                        function(sum,item) {

                            return (
                                sum +
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


                /* =================================================
                   SELLERS
                ================================================= */

                /* =================================================
   SELLER
   Current MVP = One Lightora Store
================================================= */

const LIGHTORA_STORE_ID =
"ozeREirMKKWr0XCC8cpHFTsgm7p2";


const sellerIds = [
LIGHTORA_STORE_ID
];


const mainSellerId =
LIGHTORA_STORE_ID;

                /* =================================================
                   ORDER OBJECT
                ================================================= */

                const order = {

                    customerName:
                        name,

                    phone:
                        customerPhone,

                    wilaya:
                        customerWilaya,

                    address:
                        customerAddress,

                    notes:
                        customerNotes,

                    products:
                        orderItems,

                    sellerId:
                        mainSellerId,

                    sellerIds:
                        sellerIds,

                    total:
                        total,

                    status:
                        "Pending"

                };


                console.log(
                    "Sending order:",
                    order
                );


                /* =================================================
                   CREATE ORDER
                ================================================= */

                if (placeOrderBtn) {

                    placeOrderBtn.textContent =
                        "Creating Order...";

                }


                const orderReference =
                    await createOrder(
                        order
                    );


                /* =================================================
                   UPDATE CART
                   فقط إذا كان Checkout عادي
                ================================================= */

                if (
                    !isBuyNow
                ) {

                    const orderedMap =
                        new Map();


                    orderItems.forEach(
                        function(item) {

                            orderedMap.set(
                                String(
                                    item.productId
                                ),
                                Number(
                                    item.quantity || 0
                                )
                            );

                        }
                    );


                    cart =
                        cart
                            .map(
                                function(item) {

                                    const orderedQuantity =
                                        Number(
                                            orderedMap.get(
                                                String(
                                                    item.id
                                                )
                                            ) || 0
                                        );


                                    const oldQuantity =
                                        Number(
                                            item.quantity || 0
                                        );


                                    return {

                                        ...item,

                                        quantity:
                                            oldQuantity -
                                            orderedQuantity

                                    };

                                }
                            )
                            .filter(
                                function(item) {

                                    return (
                                        Number(
                                            item.quantity || 0
                                        ) > 0
                                    );

                                }
                            );


                    saveCart();

                }


                /* =================================================
                   CLEAR BUY NOW
                ================================================= */

                if (
                    isBuyNow
                ) {

                    localStorage.removeItem(
                        "buyNowProduct"
                    );

                }


                updateCartCount();


                /* =================================================
                   SUCCESS
                ================================================= */

                showMessage(
                    "Order placed successfully!",
                    "success"
                );


                if (placeOrderBtn) {

                    placeOrderBtn.textContent =
                        "Order Placed ✓";

                }


                console.log(
                    "Order created successfully:",
                    orderReference.id
                );


                /* =================================================
                   REDIRECT
                ================================================= */

                setTimeout(
                    function() {

                        window.location.href =
                            "succes.html?id=" +
                            encodeURIComponent(
                                orderReference.id
                            );

                    },
                    1000
                );

            }

            catch (error) {

                console.error(
                    "Error creating order:",
                    error
                );


                showMessage(
                    error.message ||
                    "Could not place your order. Please try again.",
                    "error"
                );


                if (placeOrderBtn) {

                    placeOrderBtn.disabled =
                        false;

                    placeOrderBtn.textContent =
                        "Place Order";

                }

            }

        }
    );

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    text,
    type
) {

    if (!checkoutMessage) {

        return;

    }


    checkoutMessage.textContent =
        text;


    checkoutMessage.style.color =
        type === "success"
            ? "#16803c"
            : "#d93025";

}


/* =========================================================
   PRICE
========================================================= */

function formatPrice(price) {

    return Number(
        price || 0
    ).toLocaleString(
        "en-US"
    ) + " DA";

}


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHTML(value) {

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