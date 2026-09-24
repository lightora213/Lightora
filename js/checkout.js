import { createOrder } from "./services/orderService.js";
import { getProduct } from "./services/productService.js";


// ======================================================
// LIGHTORA STORE
// ======================================================

const LIGHTORA_STORE_ID = "ozeREirMKKWr0XCC8cpHFTsgm7p2";

const sellerIds = [LIGHTORA_STORE_ID];

const mainSellerId = LIGHTORA_STORE_ID;


// ======================================================
// REDEX RATES
// ======================================================

const REDEX_RATES = {
    "1":  { name: "Adrar", stopDesk: 800, home: 1500 },
    "2":  { name: "Chlef", stopDesk: 450, home: 750 },
    "3":  { name: "Laghouat", stopDesk: 550, home: 950 },
    "4":  { name: "Oum El Bouaghi", stopDesk: 450, home: 750 },
    "5":  { name: "Batna", stopDesk: 450, home: 750 },
    "6":  { name: "Béjaïa", stopDesk: 450, home: 750 },
    "7":  { name: "Biskra", stopDesk: 500, home: 800 },
    "8":  { name: "Béchar", stopDesk: 800, home: 1400 },
    "9":  { name: "Blida", stopDesk: 450, home: 750 },
    "10": { name: "Bouira", stopDesk: 450, home: 750 },
    "11": { name: "Tamanrasset", stopDesk: 800, home: 800 },
    "12": { name: "Tébessa", stopDesk: 500, home: 950 },
    "13": { name: "Tlemcen", stopDesk: 450, home: 750 },
    "14": { name: "Tiaret", stopDesk: 450, home: 750 },
    "15": { name: "Tizi Ouzou", stopDesk: 450, home: 700 },
    "16": { name: "Alger", stopDesk: 400, home: 700 },
    "17": { name: "Djelfa", stopDesk: 500, home: 800 },
    "18": { name: "Jijel", stopDesk: 450, home: 750 },
    "19": { name: "Sétif", stopDesk: 450, home: 700 },
    "20": { name: "Saïda", stopDesk: 450, home: 750 },
    "21": { name: "Skikda", stopDesk: 450, home: 750 },
    "22": { name: "Sidi Bel Abbès", stopDesk: 450, home: 750 },
    "23": { name: "Annaba", stopDesk: 450, home: 750 },
    "24": { name: "Guelma", stopDesk: 450, home: 750 },
    "25": { name: "Constantine", stopDesk: 450, home: 750 },
    "26": { name: "Médéa", stopDesk: 450, home: 750 },
    "27": { name: "Mostaganem", stopDesk: 450, home: 750 },
    "28": { name: "M'Sila", stopDesk: 450, home: 750 },
    "29": { name: "Mascara", stopDesk: 450, home: 750 },
    "30": { name: "Ouargla", stopDesk: 550, home: 950 },
    "31": { name: "Oran", stopDesk: 350, home: 450 },
    "32": { name: "El Bayadh", stopDesk: 550, home: 950 },
    "33": { name: "Illizi", stopDesk: null, home: 950 },
    "34": { name: "Bordj Bou Arreridj", stopDesk: 450, home: 750 },
    "35": { name: "Boumerdès", stopDesk: 450, home: 750 },
    "36": { name: "El Tarf", stopDesk: 500, home: 950 },
    "37": { name: "Tindouf", stopDesk: 800, home: 1700 },
    "38": { name: "Tissemsilt", stopDesk: 450, home: 750 },
    "39": { name: "El Oued", stopDesk: 550, home: 950 },
    "40": { name: "Khenchela", stopDesk: 450, home: 750 },
    "41": { name: "Souk Ahras", stopDesk: 500, home: 800 },
    "42": { name: "Tipaza", stopDesk: 450, home: 750 },
    "43": { name: "Mila", stopDesk: 450, home: 750 },
    "44": { name: "Aïn Defla", stopDesk: 450, home: 750 },
    "45": { name: "Naâma", stopDesk: 550, home: 950 },
    "46": { name: "Aïn Témouchent", stopDesk: 450, home: 750 },
    "47": { name: "Ghardaïa", stopDesk: 800, home: 1300 },
    "48": { name: "Relizane", stopDesk: 450, home: 750 },
    "49": { name: "Timimoun", stopDesk: null, home: 1700 },
    "50": { name: "Bordj Badji Mokhtar", stopDesk: null, home: 1700 },
    "51": { name: "Ouled Djellal", stopDesk: null, home: 950 },
    "52": { name: "Béni Abbès", stopDesk: null, home: 1700 },
    "53": { name: "In Salah", stopDesk: null, home: 1700 },
    "54": { name: "In Guezzam", stopDesk: null, home: 1700 },
    "55": { name: "Touggourt", stopDesk: null, home: 1100 },
    "56": { name: "Djanet", stopDesk: null, home: 1700 },
    "57": { name: "El M'Ghair", stopDesk: null, home: 1300 },
    "58": { name: "El Menia", stopDesk: null, home: 1300 }
};


// ======================================================
// START AFTER HTML IS LOADED
// ======================================================

window.addEventListener("DOMContentLoaded", async () => {

    const customerName =
        document.getElementById("customerName");

    const phone =
        document.getElementById("phone");

    const wilaya =
        document.getElementById("wilaya");

    const address =
        document.getElementById("address");

    const notes =
        document.getElementById("notes");

    const checkoutItems =
        document.getElementById("checkoutItems");

    const checkoutSubtotal =
        document.getElementById("checkoutSubtotal");

    const checkoutDelivery =
        document.getElementById("checkoutDelivery");

    const checkoutTotal =
        document.getElementById("checkoutTotal");

    const placeOrderBtn =
        document.getElementById("placeOrderBtn");

    const checkoutMessage =
        document.getElementById("checkoutMessage");

    const homeDeliveryPrice =
        document.getElementById("homeDeliveryPrice");

    const stopDeskDeliveryPrice =
        document.getElementById("stopDeskDeliveryPrice");

    const addressGroup =
        document.getElementById("addressGroup");


    // ==================================================
    // FORMAT PRICE
    // ==================================================

    function formatPrice(price) {

        return Number(price || 0).toLocaleString("fr-FR") + " DA";

    }


    // ==================================================
    // FILL WILAYA SELECT
    // ==================================================

    function initializeWilayas() {

        if (!wilaya) {

            console.error("Element #wilaya introuvable.");

            return;

        }


        // Nettoyer complètement la liste
        wilaya.innerHTML = "";


        // Première option
        const defaultOption =
            document.createElement("option");

        defaultOption.value = "";

        defaultOption.textContent =
            "Sélectionnez votre wilaya";

        defaultOption.selected = true;

        defaultOption.disabled = false;

        wilaya.appendChild(defaultOption);


        // Ajouter les 58 wilayas
        for (let code = 1; code <= 58; code++) {

            const key = String(code);

            const data = REDEX_RATES[key];


            if (!data) {

                console.warn(
                    `Wilaya ${code} absente des tarifs REDEX`
                );

                continue;

            }


            const option =
                document.createElement("option");

            option.value = key;

            option.textContent =
                `${key} - ${data.name}`;


            wilaya.appendChild(option);

        }


        console.log(
            "Wilayas chargées :",
            wilaya.options.length - 1
        );

    }


    // ==================================================
    // GET DELIVERY
    // ==================================================

    function getSelectedDelivery() {

        const selected =
            document.querySelector(
                'input[name="deliveryMethod"]:checked'
            );


        if (!selected || !wilaya.value) {

            return null;

        }


        const rate =
            REDEX_RATES[wilaya.value];


        if (!rate) {

            return null;

        }


        if (selected.value === "home") {

            return {

                company: "REDEX",

                type: "home",

                typeLabel:
                    "Livraison à domicile",

                price:
                    rate.home,

                wilayaCode:
                    wilaya.value,

                wilayaName:
                    rate.name

            };

        }


        if (
            selected.value === "stopDesk" &&
            rate.stopDesk !== null
        ) {

            return {

                company: "REDEX",

                type: "stopDesk",

                typeLabel:
                    "Stop Desk",

                price:
                    rate.stopDesk,

                wilayaCode:
                    wilaya.value,

                wilayaName:
                    rate.name

            };

        }


        return null;

    }


    // ==================================================
    // UPDATE DELIVERY PRICES
    // ==================================================

    function updateDeliveryOptions() {

        const rate =
            REDEX_RATES[wilaya.value];


        const stopDeskInput =
            document.querySelector(
                'input[name="deliveryMethod"][value="stopDesk"]'
            );


        if (!rate) {

            homeDeliveryPrice.textContent = "—";

            stopDeskDeliveryPrice.textContent = "—";

            if (stopDeskInput) {

                stopDeskInput.disabled = false;

            }

            updateAddressField();

            updateCheckoutSummary();

            return;

        }


        // HOME
        homeDeliveryPrice.textContent =
            formatPrice(rate.home);


        // STOP DESK
        if (rate.stopDesk === null) {

            stopDeskDeliveryPrice.textContent =
                "Coming Soon";


            if (stopDeskInput) {

                stopDeskInput.disabled = true;

                stopDeskInput.checked = false;

            }

        } else {

            stopDeskDeliveryPrice.textContent =
                formatPrice(rate.stopDesk);


            if (stopDeskInput) {

                stopDeskInput.disabled = false;

            }

        }


        updateAddressField();

        updateCheckoutSummary();

    }


    // ==================================================
    // ADDRESS
    // ==================================================

    function updateAddressField() {

        const selected =
            document.querySelector(
                'input[name="deliveryMethod"]:checked'
            );


        if (!selected) {

            addressGroup.style.display = "none";

            address.required = false;

            return;

        }


        if (selected.value === "home") {

            addressGroup.style.display = "block";

            address.required = true;

        } else {

            addressGroup.style.display = "none";

            address.required = false;

            address.value = "";

        }

    }


    // ==================================================
    // PRODUCTS TOTAL
    // ==================================================

    function getProductsTotal() {

        if (
            checkoutMode === "buyNow" &&
            buyNowProduct
        ) {

            return (
                Number(buyNowProduct.price || 0) *
                Number(buyNowQuantity || 1)
            );

        }


        if (checkoutMode === "cart") {

            return cartItems.reduce(
                (sum, item) => {

                    return sum +
                        (
                            Number(item.price || 0) *
                            Number(item.quantity || 1)
                        );

                },
                0
            );

        }


        return 0;

    }


    // ==================================================
    // SUMMARY
    // ==================================================

    function updateCheckoutSummary() {

        const productsTotal =
            getProductsTotal();


        const delivery =
            getSelectedDelivery();


        const deliveryPrice =
            delivery
                ? Number(delivery.price || 0)
                : 0;


        const total =
            productsTotal + deliveryPrice;


        checkoutSubtotal.textContent =
            formatPrice(productsTotal);


        checkoutDelivery.textContent =
            formatPrice(deliveryPrice);


        checkoutTotal.textContent =
            formatPrice(total);

    }


    // ==================================================
    // RENDER BUY NOW
    // ==================================================

    function renderBuyNow() {

        if (!buyNowProduct) {

            checkoutItems.innerHTML =
                "<p>Aucun produit sélectionné.</p>";

            updateCheckoutSummary();

            return;

        }


        const quantity =
            Number(buyNowQuantity || 1);


        const total =
            Number(buyNowProduct.price || 0) *
            quantity;


        checkoutItems.innerHTML = `

            <div class="checkout-product">

                <div class="checkout-product-info">

                    <strong>
                        ${buyNowProduct.name || "Produit"}
                    </strong>

                    <span>
                        Quantité : ${quantity}
                    </span>

                </div>

                <strong>
                    ${formatPrice(total)}
                </strong>

            </div>

        `;


        updateCheckoutSummary();

    }


    // ==================================================
    // RENDER CART
    // ==================================================

    function renderCart() {

        if (!cartItems.length) {

            checkoutItems.innerHTML =
                "<p>Votre panier est vide.</p>";

            updateCheckoutSummary();

            return;

        }


        checkoutItems.innerHTML =
            cartItems.map(item => {

                const quantity =
                    Number(item.quantity || 1);


                const total =
                    Number(item.price || 0) *
                    quantity;


                return `

                    <div class="checkout-product">

                        <div class="checkout-product-info">

                            <strong>
                                ${item.name || "Produit"}
                            </strong>

                            <span>
                                Quantité : ${quantity}
                            </span>

                        </div>

                        <strong>
                            ${formatPrice(total)}
                        </strong>

                    </div>

                `;

            }).join("");


        updateCheckoutSummary();

    }


    // ==================================================
    // CHECKOUT VARIABLES
    // ==================================================

    let checkoutMode = null;

    let buyNowProduct = null;

    let buyNowQuantity = 1;

    let cartItems = [];


    // ==================================================
    // LOAD BUY NOW
    // ==================================================

    async function loadBuyNow() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const productId =
            params.get("id");


        const quantity =
            Number(
                params.get("quantity") || 1
            );


        if (!productId) {

            return false;

        }


        try {

            const product =
                await getProduct(productId);


            if (!product) {

                checkoutMessage.textContent =
                    "Produit introuvable.";

                return false;

            }


            buyNowProduct = {

                id: productId,

                ...product

            };


            buyNowQuantity =
                quantity > 0
                    ? quantity
                    : 1;


            checkoutMode =
                "buyNow";


            renderBuyNow();


            return true;

        } catch (error) {

            console.error(error);

            checkoutMessage.textContent =
                "Impossible de charger le produit.";

            return false;

        }

    }


    // ==================================================
    // LOAD CART
    // ==================================================

    function loadCart() {

        const storedCart =
            localStorage.getItem("lightoraCart");


        if (!storedCart) {

            cartItems = [];

        } else {

            try {

                cartItems =
                    JSON.parse(storedCart);

                if (!Array.isArray(cartItems)) {

                    cartItems = [];

                }

            } catch {

                cartItems = [];

            }

        }


        checkoutMode =
            "cart";


        renderCart();

    }


    // ==================================================
    // INITIALIZE CHECKOUT
    // ==================================================

    async function initializeCheckout() {

        const buyNowLoaded =
            await loadBuyNow();


        if (buyNowLoaded) {

            return;

        }


        loadCart();

    }


    // ==================================================
    // VALIDATE
    // ==================================================

    function validateCustomer() {

        const name =
            customerName.value.trim();

        const customerPhone =
            phone.value.trim();


        if (!name) {

            checkoutMessage.textContent =
                "Veuillez saisir votre nom complet.";

            customerName.focus();

            return false;

        }


        if (!customerPhone) {

            checkoutMessage.textContent =
                "Veuillez saisir votre numéro de téléphone.";

            phone.focus();

            return false;

        }


        if (!wilaya.value) {

            checkoutMessage.textContent =
                "Veuillez sélectionner votre wilaya.";

            wilaya.focus();

            return false;

        }


        const delivery =
            getSelectedDelivery();


        if (!delivery) {

            checkoutMessage.textContent =
                "Veuillez sélectionner un mode de livraison.";

            return false;

        }


        if (
            delivery.type === "home" &&
            !address.value.trim()
        ) {

            checkoutMessage.textContent =
                "Veuillez saisir votre adresse.";

            address.focus();

            return false;

        }


        return true;

    }


    // ==================================================
    // PLACE ORDER
    // ==================================================

    async function placeOrder() {

        checkoutMessage.textContent = "";


        if (!validateCustomer()) {

            return;

        }


        let orderItems = [];


        if (
            checkoutMode === "buyNow" &&
            buyNowProduct
        ) {

            orderItems = [

                {

                    productId:
                        buyNowProduct.id,

                    name:
                        buyNowProduct.name,

                    price:
                        Number(
                            buyNowProduct.price || 0
                        ),

                    quantity:
                        Number(
                            buyNowQuantity || 1
                        )

                }

            ];

        }


        if (checkoutMode === "cart") {

            orderItems =
                cartItems.map(item => ({

                    productId:
                        item.id ||
                        item.productId,

                    name:
                        item.name,

                    price:
                        Number(
                            item.price || 0
                        ),

                    quantity:
                        Number(
                            item.quantity || 1
                        )

                }));

        }


        if (!orderItems.length) {

            checkoutMessage.textContent =
                "Votre commande est vide.";

            return;

        }


        const delivery =
            getSelectedDelivery();


        const productsTotal =
            orderItems.reduce(
                (sum, item) => {

                    return sum +
                        (
                            Number(item.price || 0) *
                            Number(item.quantity || 1)
                        );

                },
                0
            );


        const deliveryPrice =
            Number(delivery.price || 0);


        const total =
            productsTotal +
            deliveryPrice;


        const order = {

            customerName:
                customerName.value.trim(),

            phone:
                phone.value.trim(),

            wilaya:
                wilaya.value,

            address:
                address.value.trim(),

            notes:
                notes.value.trim(),


            products:
                orderItems,


            productsTotal:
                productsTotal,


            deliveryCompany:
                "REDEX",

            deliveryType:
                delivery.type,

            deliveryTypeLabel:
                delivery.typeLabel,

            deliveryPrice:
                deliveryPrice,

            deliveryWilayaCode:
                delivery.wilayaCode,

            deliveryWilayaName:
                delivery.wilayaName,


            sellerId:
                mainSellerId,

            sellerIds:
                sellerIds,


            total:
                total,

            status:
                "Pending"

        };


        try {

            placeOrderBtn.disabled = true;

            placeOrderBtn.textContent =
                "Traitement...";


            const orderId =
                await createOrder(order);


            if (checkoutMode === "cart") {

                localStorage.removeItem(
                    "lightoraCart"
                );

            }


            window.location.href =
                `succes.html?id=${orderId}`;


        } catch (error) {

            console.error(error);


            checkoutMessage.textContent =
                "Une erreur est survenue. Veuillez réessayer.";


            placeOrderBtn.disabled =
                false;


            placeOrderBtn.textContent =
                "Confirmer la commande";

        }

    }


    // ==================================================
    // EVENTS
    // ==================================================

    wilaya.addEventListener(
        "change",
        updateDeliveryOptions
    );


    document
        .querySelectorAll(
            'input[name="deliveryMethod"]'
        )
        .forEach(input => {

            input.addEventListener(
                "change",
                () => {

                    updateAddressField();

                    updateCheckoutSummary();

                }
            );

        });


    placeOrderBtn.addEventListener(
        "click",
        placeOrder
    );


    // ==================================================
    // IMPORTANT: LOAD WILAYAS FIRST
    // ==================================================

    initializeWilayas();

    updateAddressField();

    updateCheckoutSummary();

    await initializeCheckout();

});