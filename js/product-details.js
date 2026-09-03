import {
    getProduct
} from "./services/productService.js";


/* =========================
   DEFAULT IMAGE
========================= */

const DEFAULT_IMAGE =
    "../assets/images/perfume.jpg";


/* =========================
   PRODUCT ID
========================= */

const params =
    new URLSearchParams(
        window.location.search
    );


const productId =
    params.get("id");


/* =========================
   ELEMENTS
========================= */

const productImage =
    document.getElementById(
        "productImage"
    );


const productName =
    document.getElementById(
        "productName"
    );


const productCategory =
    document.getElementById(
        "productCategory"
    );


const productPrice =
    document.getElementById(
        "productPrice"
    );


const productDescription =
    document.getElementById(
        "productDescription"
    );


const productStock =
    document.getElementById(
        "productStock"
    );


const productStatus =
    document.getElementById(
        "productStatus"
    );


const addToCartBtn =
    document.getElementById(
        "addToCartBtn"
    );


const backBtn =
    document.getElementById(
        "backBtn"
    );


const cartCount =
    document.getElementById(
        "cartCount"
    );


/* =========================
   CART
========================= */

let cart =
    JSON.parse(
        localStorage.getItem(
            "cart"
        )
    ) || [];


/* =========================
   PRODUCT DATA
========================= */

let currentProduct =
    null;


/* =========================
   CHECK PRODUCT ID
========================= */

if (!productId) {

    alert(
        "No product was selected."
    );


    window.location.href =
        "store.html";

}


/* =========================
   UPDATE CART COUNT
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
   LOAD PRODUCT
========================= */

async function loadProduct() {

    try {

        const product =
            await getProduct(
                productId
            );


        if (!product) {

            alert(
                "Product not found."
            );


            window.location.href =
                "store.html";


            return;

        }


        currentProduct =
            product;


        /* =========================
           PRODUCT NAME
        ========================= */

        if (productName) {

            productName.textContent =
                product.name ||
                "Unnamed Product";

        }


        /* =========================
           CATEGORY
        ========================= */

        if (productCategory) {

            productCategory.textContent =
                product.category ||
                "Other";

        }


        /* =========================
           PRICE
        ========================= */

        if (productPrice) {

            productPrice.textContent =
                formatPrice(
                    product.price
                );

        }


        /* =========================
           DESCRIPTION
        ========================= */

        if (productDescription) {

            productDescription.textContent =
                product.description ||
                "No description available.";

        }


        /* =========================
           STOCK
        ========================= */

        const stock =
            Number(
                product.stock || 0
            );


        if (productStock) {

            productStock.textContent =
                stock;

        }


        /* =========================
           STATUS
        ========================= */

        if (productStatus) {

            if (stock > 0) {

                productStatus.textContent =
                    "In Stock";

            }

            else {

                productStatus.textContent =
                    "Out of Stock";

            }

        }


        /* =========================
           IMAGE
        ========================= */

        if (productImage) {

            productImage.src =
                product.image ||
                DEFAULT_IMAGE;


            productImage.alt =
                product.name ||
                "Product";

        }


        /* =========================
           ADD TO CART BUTTON
        ========================= */

        if (addToCartBtn) {

            if (stock <= 0) {

                addToCartBtn.disabled =
                    true;


                addToCartBtn.textContent =
                    "Out of Stock";

            }

        }


        console.log(
            "Product loaded:",
            product
        );

    }

    catch (error) {

        console.error(
            "Error loading product:",
            error
        );


        alert(
            "Could not load product."
        );

    }

}


/* =========================
   ADD TO CART
========================= */

function addToCart(product) {

    const stock =
        Number(
            product.stock || 0
        );


    if (stock <= 0) {

        return false;

    }


    const existing =
        cart.find(
            item =>
                item.id === product.id
        );


    if (existing) {

        if (
            existing.quantity >= stock
        ) {

            return false;

        }


        existing.quantity +=
            1;

    }

    else {

        cart.push({

            id:
                product.id,

            sellerId:
                product.sellerId ||
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
        JSON.stringify(
            cart
        )
    );


    updateCartCount();


    return true;

}


/* =========================
   ADD TO CART EVENT
========================= */

if (addToCartBtn) {

    addToCartBtn.addEventListener(
        "click",
        function () {

            if (!currentProduct) {

                return;

            }


            const added =
                addToCart(
                    currentProduct
                );


            if (!added) {

                alert(
                    "Maximum available stock reached."
                );


                return;

            }


            addToCartBtn.textContent =
                "Added ✓";


            setTimeout(
                function () {

                    addToCartBtn.textContent =
                        "Add to Cart";

                },
                1200
            );

        }
    );

}


/* =========================
   BACK
========================= */

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            window.history.back();

        }
    );

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
   START
========================= */

updateCartCount();

loadProduct();