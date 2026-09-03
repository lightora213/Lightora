import {
    getProducts,
    deleteProduct
} from "./services/productService.js";

import {
    auth,
    onAuthStateChanged
} from "../firebase.js";


const productsGrid =
    document.getElementById("productsGrid");


/* =========================
   WAIT FOR AUTH
========================= */

function waitForAuth() {

    return new Promise(function(resolve) {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                function(user) {

                    unsubscribe();

                    resolve(user);

                }
            );

    });

}


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

    try {

        const user =
            await waitForAuth();


        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        const products =
            await getProducts();


        if (
            !products ||
            products.length === 0
        ) {

            productsGrid.innerHTML = `

                <div class="product-card">

                    <h3>
                        No Products Yet
                    </h3>

                    <p>
                        Add your first product to your store.
                    </p>

                    <a
                        href="add-product.html"
                        class="buy-btn"
                    >
                        Add Product
                    </a>

                </div>

            `;

            return;

        }


        productsGrid.innerHTML = "";


        products.forEach(function(product) {

            const card =
                document.createElement("div");


            card.className =
                "product-card";


            const image =
                product.image ||
                "../images/perfume.jpg";


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

                    Stock: ${stock}

                </p>


                <div class="product-actions">

                    <a
                        href="product.html?id=${encodeURIComponent(
                            product.id
                        )}"
                        class="view-product"
                    >
                        View Product
                    </a>


                    <button
                        type="button"
                        class="delete-product"
                        data-id="${escapeHTML(
                            product.id
                        )}"
                    >
                        Delete
                    </button>

                </div>

            `;


            productsGrid.appendChild(card);

        });


        attachDeleteEvents();


    }

    catch (error) {

        console.error(
            "Error loading products:",
            error
        );


        productsGrid.innerHTML = `

            <div class="product-card">

                <h3>
                    Unable to Load Products
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


/* =========================
   DELETE PRODUCT
========================= */

function attachDeleteEvents() {

    const buttons =
        document.querySelectorAll(
            ".delete-product"
        );


    buttons.forEach(function(button) {

        button.addEventListener(
            "click",
            async function() {

                const productId =
                    button.dataset.id;


                if (!productId) {
                    return;
                }


                const confirmed =
                    confirm(
                        "Are you sure you want to delete this product?"
                    );


                if (!confirmed) {
                    return;
                }


                try {

                    button.disabled =
                        true;

                    button.textContent =
                        "Deleting...";


                    await deleteProduct(
                        productId
                    );


                    await loadProducts();


                }

                catch (error) {

                    console.error(
                        "Error deleting product:",
                        error
                    );


                    alert(
                        "Could not delete the product."
                    );


                    button.disabled =
                        false;

                    button.textContent =
                        "Delete";

                }

            }
        );

    });

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
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    return String(value || "")

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

loadProducts();