import {
    getProduct,
    updateProduct
} from "./services/productService.js";


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

const form =
    document.getElementById(
        "editProductForm"
    );


const productName =
    document.getElementById(
        "productName"
    );


const productPrice =
    document.getElementById(
        "productPrice"
    );


const productStock =
    document.getElementById(
        "productStock"
    );


const productCategory =
    document.getElementById(
        "productCategory"
    );


const productDescription =
    document.getElementById(
        "productDescription"
    );


const productStatus =
    document.getElementById(
        "productStatus"
    );


const saveProductBtn =
    document.getElementById(
        "saveProductBtn"
    );


const cancelBtn =
    document.getElementById(
        "cancelBtn"
    );


const message =
    document.getElementById(
        "editProductMessage"
    );


/* =========================
   CHECK ID
========================= */

if (!productId) {

    showMessage(
        "No product was selected.",
        "error"
    );

}
else {

    loadProduct();

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

            showMessage(
                "Product not found.",
                "error"
            );

            return;

        }


        /* =========================
           FILL FORM
        ========================= */

        productName.value =
            product.name || "";


        productPrice.value =
            product.price ?? 0;


        productStock.value =
            product.stock ?? 0;


        productCategory.value =
            product.category ||
            "Perfume";


        productDescription.value =
            product.description ||
            "";


        productStatus.value =
            product.status ||
            "active";


    }

    catch (error) {

        console.error(
            "Error loading product:",
            error
        );


        showMessage(
            "Could not load product.",
            "error"
        );

    }

}


/* =========================
   SAVE PRODUCT
========================= */

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            productName.value.trim();


        const price =
            Number(
                productPrice.value
            );


        const stock =
            Number(
                productStock.value
            );


        const category =
            productCategory.value;


        const description =
            productDescription.value.trim();


        const status =
            productStatus.value;


        /* =========================
           VALIDATION
        ========================= */

        if (!name) {

            showMessage(
                "Please enter a product name.",
                "error"
            );

            return;

        }


        if (
            Number.isNaN(price) ||
            price < 0
        ) {

            showMessage(
                "Please enter a valid price.",
                "error"
            );

            return;

        }


        if (
            Number.isNaN(stock) ||
            stock < 0
        ) {

            showMessage(
                "Please enter a valid stock.",
                "error"
            );

            return;

        }


        /* =========================
           DISABLE BUTTON
        ========================= */

        saveProductBtn.disabled =
            true;


        saveProductBtn.textContent =
            "Saving...";


        try {

            await updateProduct(
                productId,
                {

                    name:
                        name,

                    price:
                        price,

                    stock:
                        stock,

                    category:
                        category,

                    description:
                        description,

                    status:
                        status

                }
            );


            showMessage(
                "Product updated successfully!",
                "success"
            );


            setTimeout(
                function () {

                    window.location.href =
                        `product-details.html?id=${encodeURIComponent(
                            productId
                        )}`;

                },
                800
            );

        }

        catch (error) {

            console.error(
                "Error updating product:",
                error
            );


            showMessage(
                "Could not update product.",
                "error"
            );


            saveProductBtn.disabled =
                false;


            saveProductBtn.textContent =
                "💾 Save Changes";

        }

    }
);


/* =========================
   CANCEL
========================= */

cancelBtn.addEventListener(
    "click",
    function () {

        window.location.href =
            `product-details.html?id=${encodeURIComponent(
                productId
            )}`;

    }
);


/* =========================
   MESSAGE
========================= */

function showMessage(
    text,
    type
) {

    message.textContent =
        text;


    message.style.color =
        type === "success"
            ? "#16803c"
            : "#d93025";

}