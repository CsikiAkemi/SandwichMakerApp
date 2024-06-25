// Inicializálja a Kosár példányt üres kosárral és beállítja a kosár listaelemét.
export default class Cart {
    constructor(cartListElement) {
        this.cart = [];
        this.products = [];
        this.cartListElement = cartListElement;
    }
    // Beállítja a termékeket a kosárba és újra megjeleníti a kosarat HTML-ben.
    setProducts(products) {
        this.products = products;
        this.addCartToHTML(); 
    }

    // Hozzáad egy terméket a kosárhoz termék azonosító alapján, frissíti a mennyiséget ha már létezik.
    addToCart(product_id) {
        let positionThisProductInCart = this.cart.findIndex((value) => value.product_id == product_id);

        if (positionThisProductInCart < 0) {
            this.cart.push({
                product_id: product_id,
                quantity: 1
            });
        } else {
            this.cart[positionThisProductInCart].quantity += 1;
        }

        this.addCartToHTML();
        this.saveToLocalStorage();
        
        console.log("Add to cart");
    }
    // Frissíti a kosár HTML reprezentációját a jelenlegi kosár tételek alapján.
    addCartToHTML() {
        const iconCartQuantity = document.querySelector('.icon-cart-quantity');
        const iconCartTotal = document.querySelector('.icon-cart-total');
        this.cartListElement.innerHTML = '';
        let totalQuantity = 0;
        let totalPrice = 0;
        if (this.cart.length > 0) {
            this.cart.forEach(item => {
                totalQuantity += item.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;

                let positionProduct = this.products.findIndex((value) => value.id == item.product_id);
                let info = this.products[positionProduct];

                // Ellenőrizzük, hogy az info objektum létezik
                if (info) {
                    const itemTotalPrice = info.price * item.quantity;
                    totalPrice += itemTotalPrice;

                    newItem.innerHTML = `
                        <div class="image">
                            <img src="${info.imgUrl}" alt="${info.name}">
                        </div>
                        <div class="name">
                            ${info.name}
                        </div>
                        <div class="totalPrice">${itemTotalPrice} Ft</div>
                        <div class="quantity">
                            <span class="minus">-</span>
                            <span>${item.quantity}</span>
                            <span class="plus">+</span>
                        </div>
                    `;
                    this.cartListElement.appendChild(newItem);
                } else {
                    console.error(`Product with id ${item.product_id} not found`);
                }
            });
        }
        iconCartQuantity.innerText = totalQuantity;
        iconCartTotal.innerText = `${totalPrice} Ft`;
    }

    // Visszaadja az összesített árat az összes kosár tételre.
    getTotalPrice() {
        return this.cart.reduce((total, item) => {
            const product = this.products.find(p => p.id === item.product_id);
            return product ? total + (product.price * item.quantity) : total;
        }, 0);
       
    }

    // Ellenőrzi, hogy az aktuális felhasználói felületen látható-e a bejelentkezési oldal.
    isLoginPageVisible() {
        const loginPage = document.querySelector(".chechkOutUi");
        return loginPage && loginPage.style.display === "block";
    }

    // Visszaadja a termék információkat a termék azonosítója alapján a termékek listából.
    getProductInfo(product_id) {
        return this.products.find(product => product.id == product_id);
    }

    // Megváltoztatja egy kosár tétel mennyiségét a típus ('plusz' vagy 'mínusz') alapján.
    changeQuantityCart(product_id, type) {
        let positionItemInCart = this.cart.findIndex((value) => value.product_id == product_id);
        if (positionItemInCart >= 0) {
            let info = this.cart[positionItemInCart];
            switch (type) {
                case 'plus':
                    this.cart[positionItemInCart].quantity += 1;
                    break;
                default:
                    let changeQuantity = this.cart[positionItemInCart].quantity - 1;
                    if (changeQuantity > 0) {
                        this.cart[positionItemInCart].quantity = changeQuantity;
                    } else {
                        this.cart.splice(positionItemInCart, 1);
                    }
                    break;
            }
        }
        this.addCartToHTML();
        this.saveToLocalStorage();
    }

    // Inicializál egy eseményfigyelőt a kosár mennyiségének frissítéséhez a plusz/mínusz gombokra kattintáskor.
    getTotalQuantity() {
        this.cartListElement.addEventListener('click', (event) => {
            let positionClick = event.target;
            if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
                let product_id = positionClick.parentElement.parentElement.dataset.id;
                let type = 'minus';
                if (positionClick.classList.contains('plus')) {
                    type = 'plus';
                }
                this.changeQuantityCart(product_id, type);
            }
        });
    }

    // Elmenti az aktuális kosár állapotát localStorage-be.
    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Betölti a kosár adatokat localStorage-ből, ha elérhető, és frissíti az HTML reprezentációt.
    loadFromLocalStorage() {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            this.cart = JSON.parse(cartData);
        }
        this.addCartToHTML();
    }

    // Tiszta kosár törlése az alaphelyzetbe állításhoz, frissíti az HTML-t és localStorage-t.
    clearCart() {
        this.cart = [];
        this.saveToLocalStorage(); 
        this.addCartToHTML(); 
        const iconCartQuantity = document.querySelector('.icon-cart-quantity');
        iconCartQuantity.innerText = '0'; 
        const iconCartTotal = document.querySelector('.icon-cart-total');
        iconCartTotal.innerText = '0 Ft'; 
    }

}
