import {
    auth
} from "../firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getStoreProducts
} from "./services/productService.js";

import {
    getMyStore,
    getStoreById
} from "./services/storeService.js";


/* =========================
   DEFAULT IMAGE
========================= */

const DEFAULT_IMAGE =
    "../images/perfume.jpg";


/* =========================
   ELEMENTS
========================= */

const productsGrid =
    document.getElementById(
        "productsGrid"
    );

const cartCount =
    document.getElementById(
        "cartCount"
    );

const storeLogoName =
    document.getElementById(
        "storeLogoName"
    );

const storeHeroTitle =
    document.getElementById(
        "storeHeroTitle"
    );

const storeHeroDescription =
    document.getElementById(
        "storeHeroDescription"
    );

const storeBanner =
    document.getElementById(
        "storeBanner"
    );

const aboutStoreName =
    document.getElementById(
        "aboutStoreName"
    );

const aboutStoreDescription =
    document.getElementById(
        "aboutStoreDescription"
    );

const storePhone =
    document.getElementById(
        "storePhone"
    );

const storeEmail =
    document.getElementById(
        "storeEmail"
    );

const storeAddress =
    document.getElementById(
        "storeAddress"
    );


/* =========================
   STORE ID
========================= */

const params =
    new URLSearchParams(
        window.location.search
    );

const publicStoreId =
    params.get("id");


let currentStoreId =
    publicStoreId || null;


/* =========================
   PRODUCTS
========================= */

let loadedProducts = [];


/* =========================
   CART
========================= */

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


/* =========================
   CART COUNT
========================= */

function updateCartCount() {

    const count =
        cart.reduce(
            function(total, item) {

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
   STORE NOT FOUND
========================= */

function showStoreNotFound() {

    if (storeLogoName) {

        storeLogoName.textContent =
            "Store Not Found";

    }


    if (storeHeroTitle) {

        storeHeroTitle.textContent =
            "Store Not Found";

    }


    if (storeHeroDescription) {

        storeHeroDescription.textContent =
            "This store does not exist or is unavailable.";

    }


    if (aboutStoreName) {

        aboutStoreName.textContent =
            "Store Not Found";

    }


    if (aboutStoreDescription) {

        aboutStoreDescription.textContent =
            "";

    }


    if (productsGrid) {

        productsGrid.innerHTML = `

            <div class="product-card">

                <h3>
                    Store Not Found
                </h3>

                <p>
                    This store does not exist or is unavailable.
                </p>

            </div>

        `;

    }

}


/* =========================
   STORE ERROR
========================= */

function showStoreError() {

    if (storeLogoName) {

        storeLogoName.textContent =
            "Unable to Load Store";

    }


    if (storeHeroTitle) {

        storeHeroTitle.textContent =
            "Something Went Wrong";

    }


    if (storeHeroDescription) {

        storeHeroDescription.textContent =
            "Please try again later.";

    }


    if (productsGrid) {

        productsGrid.innerHTML = `

            <div class="product-card">

                <h3>
                    Unable to load store
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


/* =========================
   LOAD STORE
========================= */

async function loadStore() {

    try {

        let store = null;


        /* =========================
           PUBLIC STORE
        ========================== */

        if (publicStoreId) {

            console.log(
                "Loading public store:",
                publicStoreId
            );


            store =
                await getStoreById(
                    publicStoreId
                );

        }


        /* =========================
           CURRENT USER STORE
        ========================== */

        else {

            const user =
                await waitForAuth();


            if (!user) {

                console.warn(
                    "No user logged in."
                );


                window.location.href =
                    "login.html";


                return false;

            }


            currentStoreId =
                user.uid;


            console.log(
                "Loading current user's store:",
                currentStoreId
            );


            store =
                await getMyStore();

        }


        /* =========================
           CHECK STORE
        ========================== */

        if (!store) {

            showStoreNotFound();

            return false;

        }


        /* =========================
           STORE ID
        ========================== */

        currentStoreId =
            store.ownerId ||
            store.id ||
            currentStoreId;


        /* =========================
           STORE DATA
        ========================== */

        const storeName =
            store.name ||
            "LIGHTORA";


        const storeDescription =
            store.description ||
            "Discover quality products.";


        /* =========================
           HEADER
        ========================== */

        if (storeLogoName) {

            storeLogoName.textContent =
                storeName;

        }


        /* =========================
           HERO
        ========================== */

        if (storeHeroTitle) {

            storeHeroTitle.textContent =
                `Welcome to ${storeName}`;

        }


        if (storeHeroDescription) {

            storeHeroDescription.textContent =
                storeDescription;

        }


        /* =========================
           BANNER
        ========================== */

        if (storeBanner) {

            storeBanner.src =
                store.banner ||
                store.image ||
                DEFAULT_IMAGE;

        }


        /* =========================
           ABOUT
        ========================== */

        if (aboutStoreName) {

            aboutStoreName.textContent =
                `About ${storeName}`;

        }


        if (aboutStoreDescription) {

            aboutStoreDescription.textContent =
                storeDescription;

        }


        /* =========================
           CONTACT
        ========================== */

        if (storePhone) {

            storePhone.textContent =
                store.phone
                    ? `Phone: ${store.phone}`
                    : "";

        }


        if (storeEmail) {

            storeEmail.textContent =
                store.email
                    ? `Email: ${store.email}`
                    : "";

        }


        if (storeAddress) {

            storeAddress.textContent =
                store.address
                    ? `Address: ${store.address}`
                    : "";

        }


        console.log(
            "Store loaded successfully:",
            store
        );


        return true;

    }

    catch (error) {

        console.error(
            "Error loading store:",
            error
        );


        showStoreError();

        return false;

    }

}


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

    try {

        if (!currentStoreId) {

            productsGrid.innerHTML = `

                <div class="product-card">

                    <h3>
                        Store Not Found
                    </h3>

                </div>

            `;

            return;

        }


        productsGrid.innerHTML = `

            <div class="product-card">

                <p>
                    Loading products...
                </p>

            </div>

        `;


        /*
         * getStoreProducts()
         * returns active products.
         */

        const products =
            await getStoreProducts();


        loadedProducts =
            (products || []).filter(
                function(product) {

                    return (
                        product.sellerId ===
                        currentStoreId
                    );

                }
            );


        /* =========================
           NO PRODUCTS
        ========================== */

        if (
            loadedProducts.length === 0
        ) {

            productsGrid.innerHTML = `

                <div class="product-card">

                    <h3>
                        No Products Yet
                    </h3>

                    <p>
                        New products will appear here soon.
                    </p>

                </div>

            `;

            return;

        }


        /* =========================
           RENDER
        ========================== */

        productsGrid.innerHTML =
            "";


        loadedProducts.forEach(
            function(product) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "product-card";


                const image =
                    product.image ||
                    DEFAULT_IMAGE;


                const stock =
                    Number(
                        product.stock || 0
                    );


                card.innerHTML = `

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(
                            product.name ||
                            "Product"
                        )}"
                    >


                    <h3>
                        ${escapeHTML(
                            product.name ||
                            "Unnamed Product"
                        )}
                    </h3>


                    <p class="product-price">

                        ${formatPrice(
                            product.price
                        )}

                    </p>


                    <p class="product-stock">

                        Stock:
                        ${stock}

                    </p>


                    <div class="product-actions">

                        <button
                            type="button"
                            class="view-product"
                            data-id="${escapeHTML(
                                product.id
                            )}"
                        >
                            View Product
                        </button>


                        <button
                            type="button"
                            class="add-to-cart"
                            data-id="${escapeHTML(
                                product.id
                            )}"
                            ${stock <= 0 ? "disabled" : ""}
                        >
                            ${
                                stock <= 0
                                    ? "Out of Stock"
                                    : "Add to Cart"
                            }
                        </button>

                    </div>

                `;


                productsGrid.appendChild(
                    card
                );

            }
        );


        attachProductEvents();

    }

    catch (error) {

        console.error(
            "Error loading products:",
            error
        );


        productsGrid.innerHTML = `

            <div class="product-card">

                <h3>
                    Unable to load products
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


/* =========================
   PRODUCT EVENTS
========================= */

function attachProductEvents() {


    /* =========================
       VIEW PRODUCT
    ========================== */

    const viewButtons =
        document.querySelectorAll(
            ".view-product"
        );


    viewButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const id =
                        button.dataset.id;


                    if (!id) {

                        alert(
                            "Product ID is missing."
                        );

                        return;

                    }


                    window.location.href =
                        `product.html?id=${encodeURIComponent(
                            id
                        )}`;

                }
            );

        }
    );


    /* =========================
       ADD TO CART
    ========================== */

    const cartButtons =
        document.querySelectorAll(
            ".add-to-cart"
        );


    cartButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const id =
                        button.dataset.id;


                    const product =
                        loadedProducts.find(
                            function(item) {

                                return item.id === id;

                            }
                        );


                    if (!product) {

                        alert(
                            "Product not found."
                        );

                        return;

                    }


                    const stock =
                        Number(
                            product.stock || 0
                        );


                    if (stock <= 0) {

                        alert(
                            "This product is out of stock."
                        );

                        return;

                    }


                    const added =
                        addToCart(
                            product
                        );


                    if (!added) {

                        alert(
                            "Maximum available stock reached."
                        );

                        return;

                    }


                    button.textContent =
                        "Added ✓";


                    setTimeout(
                        function() {

                            button.textContent =
                                "Add to Cart";

                        },
                        1200
                    );

                }
            );

        }
    );

}


/* =========================
   ADD TO CART
========================= */

function addToCart(product) {

    const stock =
        Number(
            product.stock || 0
        );


    const existing =
        cart.find(
            function(item) {

                return item.id === product.id;

            }
        );


    if (existing) {

        if (
            Number(existing.quantity || 0) >= stock
        ) {

            return false;

        }


        existing.quantity += 1;

    }

    else {

        cart.push({

            id:
                product.id,

            sellerId:
                product.sellerId ||
                currentStoreId ||
                null,

            name:
                product.name ||
                "",

            price:
                Number(
                    product.price || 0
                ),

            image:
                product.image ||
                DEFAULT_IMAGE,

            quantity:
                1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();


    return true;

}


/* =========================
   PRICE FORMAT
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

    return String(
        value || ""
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

async function startStore() {

    updateCartCount();


    const storeLoaded =
        await loadStore();


    if (storeLoaded) {

        await loadProducts();

    }

}


startStore();