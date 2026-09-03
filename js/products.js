import {
    getProduct
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


const quantityInput =
    document.getElementById(
        "quantity"
    );


const decreaseQuantity =
    document.getElementById(
        "decreaseQuantity"
    );


const increaseQuantity =
    document.getElementById(
        "increaseQuantity"
    );


const addToCartBtn =
    document.getElementById(
        "addToCartBtn"
    );

    const buyNowBtn =
    document.getElementById(
        "buyNowBtn"
    );

const cartCount =
    document.getElementById(
        "cartCount"
    );


const maxQuantityMessage =
    document.getElementById(
        "maxQuantityMessage"
    );


/* =========================
   PRODUCT DATA
========================= */

let product = null;


/* =========================
   CART
========================= */

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


updateCartCount();


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
   LOAD PRODUCT
========================= */

async function loadProduct() {

    try {

        product =
            await getProduct(
                productId
            );


        /* =========================
           PRODUCT NOT FOUND
        ========================== */

        if (!product) {

            alert(
                "Product not found."
            );

            window.location.href =
                "store.html";

            return;

        }


        /* =========================
           DISPLAY PRODUCT
        ========================== */

        productName.textContent =
            product.name ||
            "Unnamed Product";


        productCategory.textContent =
            product.category ||
            "Other";


        productPrice.textContent =
            formatPrice(
                product.price
            );


        productDescription.textContent =
            product.description ||
            "No description available.";


        /* =========================
           STOCK
        ========================== */

        const stock =
            Number(
                product.stock || 0
            );


        productStock.textContent =
            stock;


        /* =========================
           IMAGE
        ========================== */

        if (product.image) {

            productImage.src =
                product.image;

        }


        /* =========================
           MAXIMUM QUANTITY MESSAGE
        ========================== */

        maxQuantityMessage.textContent =
            `Maximum available: ${stock}`;


        /* =========================
           QUANTITY INPUT
        ========================== */

        quantityInput.min =
            1;


        quantityInput.max =
            stock;


        quantityInput.value =
            stock > 0
                ? 1
                : 0;


        /* =========================
           OUT OF STOCK
        ========================== */

        if (stock <= 0) {

            quantityInput.value =
                0;


            quantityInput.disabled =
                true;


            decreaseQuantity.disabled =
                true;


            increaseQuantity.disabled =
                true;


            addToCartBtn.disabled =
                true;

                buyNowBtn.disabled =
    true;

            addToCartBtn.textContent =
                "Out of Stock";


            maxQuantityMessage.textContent =
                "Maximum available: 0";

            return;

        }


        /* =========================
           NORMAL PRODUCT
        ========================== */

        quantityInput.disabled =
            false;


        decreaseQuantity.disabled =
            false;


        increaseQuantity.disabled =
            false;


        addToCartBtn.disabled =
            false;

            buyNowBtn.disabled =
    false;

        addToCartBtn.textContent =
            "Add to Cart";


        updateQuantityButtons();

    }

    catch (error) {

        console.error(
            "Error loading product:",
            error
        );


        productName.textContent =
            "Unable to load product";


        productDescription.textContent =
            "Please try again later.";

    }

}


/* =========================
   DECREASE QUANTITY
========================= */

decreaseQuantity.addEventListener(
    "click",
    function () {

        if (!product) {
            return;
        }


        let quantity =
            Number(
                quantityInput.value
            ) || 1;


        const stock =
            Number(
                product.stock || 0
            );


        if (quantity > 1) {

            quantity--;

        }


        if (quantity > stock) {

            quantity =
                stock;

        }


        quantityInput.value =
            quantity;


        updateQuantityButtons();

    }
);


/* =========================
   INCREASE QUANTITY
========================= */

increaseQuantity.addEventListener(
    "click",
    function () {

        if (!product) {
            return;
        }


        let quantity =
            Number(
                quantityInput.value
            ) || 1;


        const stock =
            Number(
                product.stock || 0
            );


        /*
            DO NOT ALLOW
            QUANTITY > STOCK
        */

        if (quantity < stock) {

            quantity++;

        }

        else {

            quantity =
                stock;

        }


        quantityInput.value =
            quantity;


        updateQuantityButtons();

    }
);


/* =========================
   MANUAL QUANTITY INPUT
========================= */

quantityInput.addEventListener(
    "input",
    function () {

        if (!product) {
            return;
        }


        const stock =
            Number(
                product.stock || 0
            );


        let quantity =
            Number(
                quantityInput.value
            );


        /*
            EMPTY INPUT
        */

        if (
            quantityInput.value === ""
        ) {

            return;

        }


        /*
            LESS THAN 1
        */

        if (
            Number.isNaN(quantity) ||
            quantity < 1
        ) {

            quantity = 1;

        }


        /*
            MORE THAN STOCK
        */

        if (
            quantity > stock
        ) {

            quantity =
                stock;

        }


        quantityInput.value =
            quantity;


        updateQuantityButtons();

    }
);


/* =========================
   MANUAL INPUT BLUR
========================= */

quantityInput.addEventListener(
    "blur",
    function () {

        if (!product) {
            return;
        }


        const stock =
            Number(
                product.stock || 0
            );


        let quantity =
            Number(
                quantityInput.value
            );


        if (
            Number.isNaN(quantity) ||
            quantity < 1
        ) {

            quantity = 1;

        }


        if (
            quantity > stock
        ) {

            quantity =
                stock;

        }


        quantityInput.value =
            quantity;


        updateQuantityButtons();

    }
);


/* =========================
   QUANTITY BUTTONS STATE
========================= */

function updateQuantityButtons() {

    if (!product) {
        return;
    }


    const stock =
        Number(
            product.stock || 0
        );


    const quantity =
        Number(
            quantityInput.value
        ) || 1;


    /*
        DISABLE MINUS
    */

    decreaseQuantity.disabled =
        quantity <= 1;


    /*
        DISABLE PLUS
        WHEN WE REACH STOCK
    */

    increaseQuantity.disabled =
        quantity >= stock;

}


/* =========================
   ADD TO CART
========================= */

addToCartBtn.addEventListener(
    "click",
    function () {

        if (!product) {
            return;
        }


        const stock =
            Number(
                product.stock || 0
            );


        let quantity =
            Number(
                quantityInput.value
            );


        /* =========================
           VALIDATE QUANTITY
        ========================== */

        if (
            !Number.isInteger(
                quantity
            ) ||
            quantity < 1
        ) {

            quantity = 1;

        }


        /*
            IMPORTANT

            If user somehow enters
            16 while stock is 15,
            automatically return to 15.
        */

        if (
            quantity > stock
        ) {

            quantity =
                stock;


            quantityInput.value =
                stock;

        }


        if (stock <= 0) {

            alert(
                "This product is out of stock."
            );

            return;

        }


        /* =========================
           EXISTING CART ITEM
        ========================== */

        const existing =
            cart.find(
                item =>
                    item.id === product.id
            );


            if (existing) {

                existing.sellerId =
                    product.sellerId ||
                    existing.sellerId ||
                    null;
            
            
                const newQuantity =
                    existing.quantity +
                    quantity;


            /*
                DO NOT ALLOW CART
                QUANTITY > STOCK
            */

            if (
                newQuantity > stock
            ) {

                existing.quantity =
                    stock;

            }

            else {

                existing.quantity =
                    newQuantity;

            }

        }

        else {

            cart.push({

                id:
                    product.id,
            
                name:
                    product.name,
            
                price:
                    Number(
                        product.price || 0
                    ),
            
                image:
                    product.image ||
                    "../images/perfume.jpg",
            
                quantity:
                    quantity,
            
                sellerId:
                    product.sellerId ||
                    null
            
            });

        }


        /* =========================
           SAVE CART
        ========================== */

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        updateCartCount();


        /* =========================
           BUTTON MESSAGE
        ========================== */

        const oldText =
            addToCartBtn.textContent;


        addToCartBtn.textContent =
            "Added ✓";


        setTimeout(
            function () {

                addToCartBtn.textContent =
                    oldText;

            },
            1200
        );

    }
);

/* =========================
   BUY NOW
========================= */

buyNowBtn.addEventListener(
    "click",
    function () {

        if (!product) {
            return;
        }


        const stock =
            Number(
                product.stock || 0
            );


        let quantity =
            Number(
                quantityInput.value
            );


        if (
            !Number.isInteger(
                quantity
            ) ||
            quantity < 1
        ) {

            quantity = 1;

        }


        if (
            quantity > stock
        ) {

            quantity = stock;

        }


        if (stock <= 0) {

            alert(
                "This product is out of stock."
            );

            return;

        }


        /*
           SAVE DIRECT ORDER
        */

           const buyNowProduct = {

            id:
                product.id,
        
            name:
                product.name,
        
            price:
                Number(
                    product.price || 0
                ),
        
            image:
                product.image ||
                "../images/perfume.jpg",
        
            quantity:
                quantity,
        
            stock:
                stock,
        
            sellerId:
                product.sellerId ||
                null
        
        };


        localStorage.setItem(
            "buyNowProduct",
            JSON.stringify(
                buyNowProduct
            )
        );


        window.location.href =
            "checkout.html?buyNow=true";

    }
);


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

loadProduct();