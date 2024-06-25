import DataHandler from './js/productDataGet.js';
import Cart from './js/cart.js';
import UIHandler from './js/UiHandler.js';
import Product from './js/product.js';

document.addEventListener('DOMContentLoaded', () => {
    const productListElement = document.querySelector('.listProduct');
    const cartListElement = document.querySelector('.listCart');
    const iconCart = document.querySelector('.icon-cart');
    const closeCartButton = document.querySelector('.close');
    const nextButton = document.querySelector('.nextButton');
    const previousButton = document.querySelector('.previousButton');
    const checkOutButton = document.querySelector(".checkOut");

    DataHandler
        .fetchProducts()
        .then(products => {
            const cart = new Cart(cartListElement);
            const uiHandler = new UIHandler(
                productListElement,
                cartListElement,
                iconCart,
                closeCartButton,
                cart,
            );
            console.log(products);
            uiHandler.displayProducts(products);
            cart.setProducts(products); // Hozzárendeljük a termékeket a cart-hoz

            // Termékek betöltése és megjelenítése
            uiHandler.loadProducts(products);

            // Navigációs gombok hozzáadása
            uiHandler.addNavigationButtons();

            // Betöltjük a kosarat a helyi tárolóból
            cart.loadFromLocalStorage();

            // Eseményfigyelők beállítása
            iconCart.addEventListener('click', () => uiHandler.toggleCart());
            closeCartButton.addEventListener('click', () => uiHandler.toggleCart());
            uiHandler.setupEventListeners();
            cart.getTotalQuantity(); // Eseményfigyelők beállítása a kosár mennyiségének változtatására

            // Next és Previous gombok eseményfigyelőinek beállítása
            nextButton.addEventListener('click', () => {
                uiHandler.nextCategory();
            });
            previousButton.addEventListener('click', () => {
                uiHandler.previousCategory();
            });

            // Checkout gomb eseményfigyelő
            checkOutButton.addEventListener('click', () => {
                uiHandler.loginPageUi(); // A megfelelő metódus hívása
                uiHandler.showLogin();
            });

        });

});
