document.addEventListener('DOMContentLoaded', () => {
    class Alerts{
        static deleteProductConfirm(){
            Swal.fire({
                title: "¿Estás seguro?",
                text: "¡No podrás revertir esta acción!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminarlo",
                cancelButtonText: "Cancelar"
            });
        }

        static deleteProduct(){
            Swal.fire({
                title: "¡Eliminado!",
                text: "El producto ha sido eliminado del carrito.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        }
    }


    function loadCartItems() {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];    
        cartItemsContainer.innerHTML = '';    
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<em>No hay productos en el carrito.</em>';
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
                                <button class="btn btn-danger delete-btn mt-3">
                                    <i class="fa-regular fa-trash-can"></i> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                const minusBtn = productCard.querySelector('.minus-btn');
                const plusBtn = productCard.querySelector('.plus-btn');
                const quantityInput = productCard.querySelector('.quantity-input');
                const totalPrice = productCard.querySelector('.total-price');
                const deleteBtn = productCard.querySelector('.delete-btn');              
    
                
                function updateMinusButtonState() { //esta funcion hace que cuando el monto sea igual a 1 me deshabilite el boton de "-"
                    const quantity = parseInt(quantityInput.value);
                    if (quantity <= 1) {
                        minusBtn.disabled = true;
                    } else {
                        minusBtn.disabled = false;
                    }
                }    
                updateMinusButtonState();
    
                function updatePrice() { //esta funcion es la que calcula el totral de todos los productos
                    const quantity = parseInt(quantityInput.value);
                    const total = (product.price * quantity).toFixed(2);
                    totalPrice.textContent = `$${total}`;
                    updateLocalStorage();
                    updateCartSummary(); 
                    updateMinusButtonState();
                }
    
                minusBtn.addEventListener('click', () => { //este evento hace que disminuya nla cantidad
                    let quantity = parseInt(quantityInput.value);
                    if (quantity > 1) {
                        quantity--;
                        quantityInput.value = quantity;
                        product.amount = quantity;
                        updatePrice();
                    }
                });
    
                plusBtn.addEventListener('click', () => { //este evento hace que aumente la cantidad del producto
                    let quantity = parseInt(quantityInput.value);
                    quantity++;
                    quantityInput.value = quantity;
                    product.amount = quantity;
                    updatePrice();
                });
    
                quantityInput.addEventListener('input', () => { //este evento hace que evite un error
                    const quantity = parseInt(quantityInput.value);
                    if (!isNaN(quantity) && quantity > 0) {
                        product.amount = quantity;
                        updatePrice();
                    }
                });
    
                function updateLocalStorage() { //actualizamos el LS
                    localStorage.setItem('shoppingCart', JSON.stringify(cart));
                }
    
                deleteBtn.addEventListener('click', () => { //este evento elimina el iten del carrito
                    Swal.fire({
                        title: "¿Estás seguro?",
                        text: "¡No podrás revertir esta acción!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Sí, eliminarlo",
                        cancelButtonText: "Cancelar"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            cart.splice(index, 1);
                            localStorage.setItem('shoppingCart', JSON.stringify(cart));
                            loadCartItems();  
                            Alerts.deleteProduct()  
                        }
                    });
                });
                
                cartItemsContainer.appendChild(productCard);
            });    
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
                    <div>
                        <button id="payButton" class="btn btn-success">Finalizar compra</button>
                        <button id="clearCartButton" class="btn btn-danger">Vaciar Carrito</button>
                    </div>
                </div>
            `;
            document.getElementById('cartItemsContainer').appendChild(summaryDiv);
            document.getElementById('payButton').addEventListener('click', handlePayButtonClick);
            document.getElementById('clearCartButton').addEventListener('click', handleClearCart);
        } else {
            summaryDiv.querySelector('h5').textContent = `Total: $${total}`;
        }
    }


    function handlePayButtonClick() {
        const payButton = document.getElementById('payButton');
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const total = cart.reduce((sum, product) => sum + (product.price * product.amount), 0).toFixed(2);
        payButton.removeEventListener('click', handlePayButtonClick);
        
        // Mostrar la alerta de confirmación
        Swal.fire({
            title: `Desea finalizar la compra Total:$${total}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ir a login!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Redirigiendo...',
                    text: 'Será redirigido a la página de inicio de sesión.',
                    icon: 'info',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'login.html';
                });
                loadCartItems();
            }
        });
    }
    

    function handleClearCart() {
        Swal.fire({
            title: '¿Estás seguro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, vaciar carrito',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('shoppingCart');
                loadCartItems();
                Swal.fire({
                    title: '¡Carrito Vaciado!',
                    text: 'Todos los productos han sido eliminados del carrito.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    }


    const shoppingCartModal = document.getElementById('shoppingCartModal');
    shoppingCartModal.addEventListener('shown.bs.modal', () => {
        loadCartItems();
    });
});
