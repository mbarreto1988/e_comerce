document.addEventListener('DOMContentLoaded', () => {
    function loadCartItems() {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
        } else {
            cart.forEach((product, index) => {
                const productCard = document.createElement('div');
                productCard.className = 'card mb-3';
                productCard.innerHTML = `
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${product.image}" class="img-fluid rounded-start" alt="${product.title}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${product.title}</h5>
                                <p class="card-text total-price">$${(product.price * product.amount).toFixed(2)}</p>
                                <div class="quantity-controls d-flex align-items-center">
                                    <button class="btn btn-sm btn-outline-secondary minus-btn">-</button>
                                    <input type="text" class="form-control text-center mx-2 quantity-input" value="${product.amount}" style="width: 50px;">
                                    <button class="btn btn-sm btn-outline-secondary plus-btn">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                const minusBtn = productCard.querySelector('.minus-btn');
                const plusBtn = productCard.querySelector('.plus-btn');
                const quantityInput = productCard.querySelector('.quantity-input');
                const totalPrice = productCard.querySelector('.total-price');

                // Actualizar el precio y localStorage al cambiar la cantidad
                function updatePrice() {
                    const quantity = parseInt(quantityInput.value);
                    const total = (product.price * quantity).toFixed(2);
                    totalPrice.textContent = `$${total}`;
                    updateLocalStorage();
                    updateCartSummary(); // Recalcular el total del carrito
                }

                minusBtn.addEventListener('click', () => {
                    let quantity = parseInt(quantityInput.value);
                    if (quantity > 1) {
                        quantity--;
                        quantityInput.value = quantity;
                        product.amount = quantity;
                        updatePrice();
                    } else {
                        cart.splice(index, 1);
                        localStorage.setItem('shoppingCart', JSON.stringify(cart));
                        loadCartItems();
                    }
                });

                plusBtn.addEventListener('click', () => {
                    let quantity = parseInt(quantityInput.value);
                    quantity++;
                    quantityInput.value = quantity;
                    product.amount = quantity;
                    updatePrice();
                });

                quantityInput.addEventListener('input', () => {
                    const quantity = parseInt(quantityInput.value);
                    if (!isNaN(quantity) && quantity > 0) {
                        product.amount = quantity;
                        updatePrice();
                    }
                });

                function updateLocalStorage() {
                    localStorage.setItem('shoppingCart', JSON.stringify(cart));
                }
                
                cartItemsContainer.appendChild(productCard);
            });

            // Mostrar total y botón de pago
            updateCartSummary();
        }
    }

    function updateCartSummary() {
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const total = cart.reduce((sum, product) => sum + (product.price * product.amount), 0).toFixed(2);
        
        let summaryDiv = document.getElementById('cartSummary');
        if (!summaryDiv) {
            summaryDiv = document.createElement('div');
            summaryDiv.id = 'cartSummary';
            summaryDiv.innerHTML = `
                <hr>
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5>Total: $${total}</h5>
                    <button id="payButton" class="btn btn-success">Pagar</button>
                </div>
            `;
            document.getElementById('cartItemsContainer').appendChild(summaryDiv);

            // Asegúrate de que el evento se añade solo una vez
            document.getElementById('payButton').addEventListener('click', handlePayButtonClick);
        } else {
            summaryDiv.querySelector('h5').textContent = `Total : $${total}`;
        }
    }

    function handlePayButtonClick() {
        // Asegúrate de que el evento se ejecuta solo una vez
        const payButton = document.getElementById('payButton');
        payButton.removeEventListener('click', handlePayButtonClick);

        if (confirm('¿Estás seguro de que deseas realizar la compra?')) {
            localStorage.removeItem('shoppingCart');
            loadCartItems();
        }
    }

    const shoppingCartModal = document.getElementById('shoppingCartModal');
    shoppingCartModal.addEventListener('shown.bs.modal', () => {
        loadCartItems();
    });
});