export default class UIHandler {
    constructor(
        productListElement,
        cartListElement,
        iconCart,
        closeCartButton,
        cartInstance
    ) {
        this.productListElement = productListElement;
        this.cartListElement = cartListElement;
        this.iconCart = iconCart;
        this.closeCartButton = closeCartButton;
        this.cartInstance = cartInstance; // A Cart példány
        this.currentCategoryIndex = 0; // Jelenlegi kategória indexe
        this.categories = [];
        this.products = []; // Hozzáadva: termékek tárolása
        this.cartVisible = true; // Kosár láthatósága alapértelmezetten true

        this.setupEventListeners(); // Eseményfigyelők beállítása már a konstruktorban
    }

    // Termékek betöltése és kategorizálása
    loadProducts(products) {
        if (!products || !Array.isArray(products)) {
            console.error('A products paraméter vagy undefined, vagy nem tömb');
            return;
        }

        this.products = products;
        this.filterByCategory();
        this.displayProducts();
        this.addNavigationButtons();

    }

    // Termékek megjelenítése a HTML-ben a jelenlegi kategóriában
    displayProducts() {
        // Elrejtjük a bejelentkezési felületet, ha meg van jelenítve
        const loginUi = document.querySelector(".chechkOutUi");
        if (loginUi) {
            loginUi.style.display = "none";
        } else {
            this.productListElement.innerHTML = '';
        }

        // Töröljük a korábban megjelenített termékeket
        this.productListElement.innerHTML = '';

        // Ha a categories üres, akkor nincs mit megjeleníteni
        if (this.categories.length === 0) {
            return;
        }

        // Kategórián belüli termékek megjelenítése
        const currentCategory = this.categories[this.currentCategoryIndex];
        const categoryProducts = this.products.filter(product => product.type === currentCategory);

        categoryProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.imgUrl}" alt="">
                <h2>${product.name}</h2>
                <div class="price">${product.price}Ft</div>
                <button class="addCart">Kosárba</button>`;
            this.productListElement.appendChild(newProduct);

        });

        document.addEventListener('DOMContentLoaded', function () {
            this.prevButton = document.querySelector('.previousButton');
            this.nextButton = document.querySelector('.nextButton');

            // To show both buttons
            this.prevButton.style.display = "block";
            this.nextButton.style.display = "block";
        });

    }

    // Kosár megjelenítése/elrejtése
    toggleCart() {
        let body = document.querySelector('body');
        body.classList.toggle('showCart');
    }

    // Eseményfigyelők beállítása
    setupEventListeners() {
        // Ellenőrizze, hogy már hozzá lett-e adva az eseményfigyelő
        if (!this.eventListenersSet) {
            this.productListElement.addEventListener('click', (event) => {
                    let positionClick = event.target;
                    if (positionClick.classList.contains('addCart')) {
                        let id_product = positionClick.parentElement.dataset.id;
                        this.cartInstance.addToCart(id_product);
                    }
                });

            this.eventListenersSet = true; // Állítsa be, hogy már hozzá lett adva az eseményfigyelő
        }

        // Bejelentkezés gomb eseményfigyelő
        const checkOutButton = document.querySelector(".checkOut");
        checkOutButton.addEventListener('click', () => {
            this.showLogin();
            this.loginPageUi();
        });
    }

    // Összetevők szűrése kategóriánként
    filterByCategory() {
        const grouped = this._groupByCategory(this.products);
        this.categories = Object.keys(grouped);
    }

    // Privát segédmetódus a termékek csoportosítására kategóriánként
    _groupByCategory(products) {
        return products.reduce((acc, product) => {
            const category = product.type; // Kategória meghatározása
            if (!acc[category]) { // Ha a kategória még nem létezik az acc objektumban
                acc[category] = []; // Létrehozzuk az adott kategóriát az acc objektumban
            }
            acc[category].push(product); // A termék hozzáadása a megfelelő kategóriához az acc objektumban
            return acc; // Visszaadjuk az acc objektumot
        }, {});
    }

    // Kategória beállítása
    setCategory(categoryIndex) {
        if (categoryIndex >= 0 && categoryIndex < this.categories.length) {
            this.currentCategoryIndex = categoryIndex;
            this.displayProducts();
            this.addNavigationButtons();
        }
    }

    // Következő kategória
    nextCategory() {
        this.currentCategoryIndex = (this.currentCategoryIndex + 1) % this.categories.length;
        this.displayProducts();
        this.addNavigationButtons();
    }

    // Előző kategória
    previousCategory() {
        this.currentCategoryIndex = (
            this.currentCategoryIndex - 1 + this.categories.length) % this.categories.length;
        this.displayProducts();
        this.addNavigationButtons();
    }

   addNavigationButtons() {
    // Ellenőrizzük, hogy már léteznek-e a navigációs gombok a HTML-ben
    let prevButton = document.querySelector('.previousButton');
    let nextButton = document.querySelector('.nextButton');

    // Ha a gombok nem léteznek, létrehozzuk őket
    if (!prevButton) {
        prevButton = document.createElement('button');
        prevButton.className = 'previousButton';
        prevButton.innerText = 'Previous';
        prevButton.addEventListener('click', () => {
            this.previousCategory();
        });
    }

    if (!nextButton) {
        nextButton = document.createElement('button');
        nextButton.className = 'nextButton';
        nextButton.innerText = 'Next';
        nextButton.addEventListener('click', () => {
            this.nextCategory();
        });
    }

    // Ellenőrizzük, hogy a bejelentkezés felület jelen van-e
    const isLoginPageVisible = document.querySelector('.chechkOutUi');
    if (isLoginPageVisible) {
        if (prevButton && prevButton.parentNode) {
            prevButton.parentNode.removeChild(prevButton);
        }
        if (nextButton && nextButton.parentNode) {
            nextButton.parentNode.removeChild(nextButton);
        }
    }

    // Ellenőrizzük az aktuális kategóriát és kezeljük a gombokat
    const currentCategory = this.categories[this.currentCategoryIndex];

    // Ellenőrizzük, hogy van-e további kategória a jelenlegi után
    const hasNextCategory = this.currentCategoryIndex < this.categories.length - 1;

    if (!hasNextCategory && currentCategory === 'souse') {
        // Ha a jelenlegi kategória 'souse' és nincs további kategória utána, csak a Previous gomb legyen látható
        if (nextButton.parentNode) {
            nextButton.remove();
            console.log("Next button removed");
        }
        if (!prevButton.parentNode) {
            document.body.appendChild(prevButton);
            console.log("Previous button added");
        }
    } else if (!hasNextCategory) {
        // Ha nincs további kategória utána (és nem 'souse' kategória), mindkét gombot eltávolítjuk
        if (prevButton.parentNode) {
            prevButton.remove();
            console.log("Previous button removed");
        }
        if (nextButton.parentNode) {
            nextButton.remove();
            console.log("Next button removed");
        }
    } else {
        // Ha van további kategória, megfelelően kezeljük a gombokat
        if (currentCategory === 'baked goods') {
            if (prevButton.parentNode) {
                prevButton.remove();
                console.log("Previous button removed");
            }
            if (!nextButton.parentNode) {
                document.body.appendChild(nextButton);
                console.log("Next button added");
            }
        } else if (currentCategory === 'souse') {
            if (nextButton.parentNode) {
                nextButton.remove();
                console.log("Next button removed");
            }
            if (!prevButton.parentNode) {
                document.body.appendChild(prevButton);
                console.log("Previous button added");
            }
        } else {
            // Minden más kategóriához hozzáadjuk mindkét gombot, ha még nincsenek hozzáadva
            if (!prevButton.parentNode) {
                document.body.appendChild(prevButton);
                console.log("Previous button added");
            }
            if (!nextButton.parentNode) {
                document.body.appendChild(nextButton);
                console.log("Next button added");
            }

            

        }

        
    }

    
}


    // Bejelentkezés gomb eseményfigyelő
    checkOutButton() {
        const checkOutButton = document.querySelector(".checkOut"); // Gomb kiválasztása
        checkOutButton.addEventListener("click", () => {
            this.loginPageUi();
            this.showLogin();

            const prevButton = document.querySelector('.previousButton');

            // Ha nincs jelenleg prev gomb, hozzáadjuk a testhez
            if (!prevButton.parentNode) {
                document
                    .body
                    .appendChild(prevButton);
            }

            if (nextButton.parentNode) {
                nextButton.remove();
                console.log("Előre gomb eltávolítva");

            }
        });
    }
    // Bejelentkezési felület megjelenítése
    showLogin() {
        const checkOutUi = document.querySelector(".chechkOutUi");
        const checkOutButton = document.querySelector(".checkOut");
        const cartTab = document.querySelector(".cartTab");

        if (checkOutUi) {
            checkOutUi.style.display = "block";
            this.productListElement.style.display = "none";
            this.cartListElement.style.display = "none";
            this.iconCart.style.display = "none";
            this.closeCartButton.style.display = "none";
            this.cartVisible = false;

        }

        if (checkOutButton) {
            checkOutButton.style.display = "none";
      


        }

        if (cartTab) {
            cartTab.style.visibility = "hidden";
        }

    }
    // Login felulet elrejtése
    hideLogin() {
        const checkOutUi = document.querySelector(".chechkOutUi");
        if (checkOutUi) {
            checkOutUi.style.display = "none";
        }
    }

    //Felhasználoi Login felulet HTML
    loginPageUi() {
        const form = document.querySelector('#form');
        const usernameInput = document.querySelector('#username');
        const emailInput = document.querySelector('#email');
        const submitButton = document.querySelector('#submit');
        const backButton = document.querySelector('#back');

        const errorMessages = document.querySelector('#errorMessages');

        const showError = (input, message) => {
            const formControl = input.parentElement;
            formControl.className = 'form-control error';
            const small = formControl.querySelector('#small');
            small.innerText = message;
        };

        const showSuccess = (input) => {
            const formControl = input.parentElement;
            formControl.className = 'form-control success';
            const small = formControl.querySelector('#small');
            small.innerText = 'Looks good!';
        };

        const checkUsername = () => {
            const username = usernameInput
                .value
                .trim();
            const usernamePattern = /^[a-zA-Z0-9]{3,}$/;
            if (!usernamePattern.test(username)) {
                showError(
                    usernameInput,
                    'The username must be at least 3 characters long and contain only alphanumeric ' +
                            'characters.'
                );
                return false;
            } else {
                showSuccess(usernameInput);
                return true;
            }
        };

        const checkEmail = () => {
            const email = emailInput
                .value
                .trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showError(emailInput, 'Invalid email address.');
                return false;
            } else {
                showSuccess(emailInput);
                return true;
            }
        };

        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            errorMessages.innerHTML = "";
            const isUsernameValid = checkUsername();
            const isEmailValid = checkEmail();

            if (isUsernameValid && isEmailValid) {
                console.log("Form submitted!");
                const username = usernameInput.value;
                console.log("Username: ", username);

                console.log("Email: ", emailInput.value);
                form.reset();
                const formControls = form.querySelectorAll('.form-control');
                formControls.forEach(control => control.className = 'form-control');

                this.hideLogin();
                this.cartListElement.style.display = "block";

                this.displayCartAfterLogin(username);
            }
        });

        backButton.addEventListener('click', (event) => {
            setCategory(this.currentCategoryIndex - 1)
        });
    }

    // Bejelentkezés utáni Kosár megjelenitése
    displayCartAfterLogin(username) {
        this.cartVisible = false;
        this.username = username;
        this.loggedIn = true;

        let totalPrice = 0;

        // Kosár elemeinek megjelenítése és árának kiszámítása
        const cartItemsContainer = document.createElement('div');
        cartItemsContainer
            .classList
            .add('cartItems');

        this
            .cartInstance
            .cart
            .forEach(item => {
                const product = this
                    .cartInstance
                    .getProductInfo(item.product_id);
                if (product) {
                    const itemTotalPrice = product.price * item.quantity;
                    totalPrice += itemTotalPrice;

                    const cartItem = document.createElement('div');
                    cartItem
                        .classList
                        .add('cartItem');
                    cartItem.innerHTML = `
                    <div class="itemImage">
                        <img src="${product.imgUrl}" alt="${product.name}">
                    </div>
                    <div class="itemDetails">
                        <div class="itemName">${product.name}</div>
                        <div class="itemPrice">${product.price} Ft</div>
                        <div class="itemQuantity">
                            <span class="minus">-</span>
                            <span>${item.quantity}</span>
                            <span class="plus">+</span>
                        </div>
                    </div>
                    <div class="itemTotalPrice">${itemTotalPrice} Ft</div>
                `;

                    // Event listeners for quantity adjustment
                    const minusButton = cartItem.querySelector('.minus');
                    const plusButton = cartItem.querySelector('.plus');

                    minusButton.addEventListener('click', () => {
                        this
                            .cartInstance
                            .changeQuantityCart(item.product_id, 'minus');
                        this.displayCartAfterLogin(username); // Refresh cart display after quantity change
                    });

                    plusButton.addEventListener('click', () => {
                        this
                            .cartInstance
                            .changeQuantityCart(item.product_id, 'plus');
                        this.displayCartAfterLogin(username); // Refresh cart display after quantity change
                    });

                    cartItemsContainer.appendChild(cartItem);
                } else {
                    console.error(`Product with id ${item.product_id} not found`);
                }
            });

        // CartContainer létrehozása és tartalmának beállítása
        const cartContainer = document.createElement('div');
        cartContainer
            .classList
            .add('cartContainer');

        const cartContent = document.createElement('div');
        cartContent
            .classList
            .add('cartContent');
        cartContent.innerHTML = `
            <h2>Your Cart</h2>
            <h3>${this.username}'s Cart</h3>
            <div class="cartItems" id="cartItems">
                <!-- Kosár elemeinek helye -->
            </div>
            <div class="cartTotal" id="cartTotal">
                Total: ${totalPrice} Ft
            </div>
            <div class="cartButtons">
                <button class="backButton">Back</button>
                <button class="orderButton">Order</button>
            </div>
        `;

        cartContent
            .querySelector('#cartItems')
            .appendChild(cartItemsContainer);
        cartContainer.appendChild(cartContent);
        document
            .body
            .appendChild(cartContainer);

        // Event listener for orderButton
        const orderButton = cartContent.querySelector('.orderButton');
        orderButton.addEventListener('click', () => {
            cartContainer.remove();
            this.orderSubmitPage();
        });

        // Event listener for backButton
        const backButton = cartContent.querySelector('.backButton');
        backButton.addEventListener('click', () => {
            window.location.href = './index.html';
        });
    }
    // Rendelés megerosito oldal
    orderSubmitPage() {
        const thankYouContainer = document.createElement('div');
        thankYouContainer
            .classList
            .add('thankYouMessage');
        thankYouContainer.innerHTML = `
            <h2>Thank you, ${this.username}, for your order!</h2>
            <button class="newOrderButton">Place New Order</button>
        `;

        // Event listener for newOrderButton
        const newOrderButton = thankYouContainer.querySelector('.newOrderButton');
        newOrderButton.addEventListener('click', () => {
            // Clear the cart
            this
                .cartInstance
                .clearCart();

            // Reload and display products
            this.loadProducts();
            this.displayProducts();

            // Navigate to the start page 
            window.location.href = './index.html';
        });

        document
            .body
            .appendChild(thankYouContainer);
    }
    // Termékek megjeleniétse
    showProducts() {
        this.productListElement.style.display = "block";
    }

    
}