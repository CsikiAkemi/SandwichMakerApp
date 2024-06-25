export default class DataHandler {
    
    static async fetchProducts() {
        const response = await fetch('./ingredinetsData.json');
        console.log("OK");
        return await response.json();
       
    }

    static getCartFromLocalStorage() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    static saveCartToLocalStorage(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }


}