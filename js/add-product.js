import { addProduct } from "./services/productService.js";

const form = document.getElementById("productForm");

const productName =
    document.getElementById("productName");

const productPrice =
    document.getElementById("productPrice");

const productStock =
    document.getElementById("productStock");

const productCategory =
    document.getElementById("productCategory");

const productDescription =
    document.getElementById("productDescription");

const productImage =
    document.getElementById("productImage");


/* =========================================================
   FORM SUBMIT
========================================================= */

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name =
        productName.value.trim();

    const price =
        Number(productPrice.value);

    const stock =
        Number(productStock.value);

    const category =
        productCategory.value;

    const description =
        productDescription.value.trim();

    const imageFile =
        productImage.files[0];


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!name) {

        alert("Please enter the product name.");

        productName.focus();

        return;

    }


    if (
        !Number.isFinite(price) ||
        price <= 0
    ) {

        alert("Please enter a valid price.");

        productPrice.focus();

        return;

    }


    if (
        !Number.isFinite(stock) ||
        stock < 0
    ) {

        alert("Please enter a valid stock quantity.");

        productStock.focus();

        return;

    }


    const button =
        form.querySelector(
            "button[type='submit']"
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "Preparing Product...";

    }


    try {

        /* =================================================
           IMAGE
        ================================================= */

        let image = "";


        if (imageFile) {

            image =
                await compressImage(
                    imageFile
                );

        }


        /* =================================================
           PRODUCT
        ================================================= */

        const product = {

            name:
                name,

            price:
                price,

            stock:
                Math.floor(stock),

            category:
                category,

            description:
                description,

            image:
                image

        };


        console.log(
            "Saving product:",
            product
        );


        if (button) {

            button.textContent =
                "Saving Product...";

        }


        /* =================================================
           SAVE
        ================================================= */

        await addProduct(
            product
        );


        alert(
            "Product added successfully!"
        );


        form.reset();


        /* =================================================
           PRODUCTS PAGE
        ================================================= */

        window.location.href =
            "products.html";

    }

    catch (error) {

        console.error(
            "Error adding product:",
            error
        );


        alert(
            error.message ||
            "Could not add the product. Please try again."
        );


        if (button) {

            button.disabled = false;

            button.textContent =
                "Save Product";

        }

    }

});


/* =========================================================
   COMPRESS IMAGE
========================================================= */

function compressImage(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function () {

                    const image =
                        new Image();


                    image.onload =
                        function () {

                            /* =================================
                               MAX IMAGE SIZE
                            ================================= */

                            const MAX_WIDTH =
                                1200;

                            const MAX_HEIGHT =
                                1200;


                            let width =
                                image.width;

                            let height =
                                image.height;


                            if (
                                width >
                                MAX_WIDTH ||
                                height >
                                MAX_HEIGHT
                            ) {

                                const widthRatio =
                                    MAX_WIDTH /
                                    width;

                                const heightRatio =
                                    MAX_HEIGHT /
                                    height;

                                const ratio =
                                    Math.min(
                                        widthRatio,
                                        heightRatio
                                    );


                                width =
                                    Math.round(
                                        width * ratio
                                    );

                                height =
                                    Math.round(
                                        height * ratio
                                    );

                            }


                            /* =================================
                               CANVAS
                            ================================= */

                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                width;

                            canvas.height =
                                height;


                            const context =
                                canvas.getContext(
                                    "2d"
                                );


                            context.drawImage(
                                image,
                                0,
                                0,
                                width,
                                height
                            );


                            /* =================================
                               JPEG COMPRESSION
                            ================================= */

                            let quality =
                                0.75;


                            let dataURL =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    quality
                                );


                            /*
                             * If the image is still too large,
                             * compress it further.
                             */

                            while (
                                dataURL.length >
                                900000 &&
                                quality >
                                0.40
                            ) {

                                quality -=
                                    0.10;


                                dataURL =
                                    canvas.toDataURL(
                                        "image/jpeg",
                                        quality
                                    );

                            }


                            /*
                             * Safety check.
                             */

                            if (
                                dataURL.length >
                                1000000
                            ) {

                                reject(
                                    new Error(
                                        "The image is still too large. Please choose a smaller image."
                                    )
                                );

                                return;

                            }


                            console.log(
                                "Image compressed successfully:",
                                Math.round(
                                    dataURL.length / 1024
                                ) + " KB"
                            );


                            resolve(
                                dataURL
                            );

                        };


                    image.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Could not load the selected image."
                                )
                            );

                        };


                    image.src =
                        reader.result;

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Could not read the selected image."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}