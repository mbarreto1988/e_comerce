document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://fakestoreapi.com';
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');


    class Alerts{
        static paySuccessful(message){
            Swal.fire({
                icon: 'success',
                title: '¡Compra realizada!',
                text: message,
                timer: 3000,
                showConfirmButton: false
            });
        }

        static addProduct(){
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Producto Agregado al Carrito',
                showConfirmButton: false,
                timer: 1500
            });
        }
    }

    
    if (localStorage.getItem('showPayAlert') === 'true') { 
        Alerts.paySuccessful('Gracias por tu compra');
        localStorage.removeItem('showPayAlert'); 
        localStorage.removeItem('shoppingCart');
    }


    async function fetchProducts(category = '') { 
        try {
            let url = `${API_BASE_URL}/products`;
            if (category) {
                url = `${url}/category/${encodeURIComponent(category)}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            const products = await response.json();
            const card_product = document.getElementById('card_product');
            card_product.innerHTML = '';
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'card';
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.title}" class="card-img-top">
                    <div class="card-content">
                        <h5 class="card-title">${product.title}</h5>
                        <a href="#" class="btn btn-primary view-details-btn" data-id="${product.id}">Ver Detalles</a>
                    </div>`;
                card_product.appendChild(productDiv);

                productDiv.querySelector('.view-details-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    showProductDetails(product);
                });
            });
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    }


    function isProductInCart(productId) { 
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        return cart.some(product => product.id === productId);
    }


    function showProductDetails(product) { 
        const productDetailModal = new bootstrap.Modal(document.getElementById('productDetailModal'));
        const productDetailTitle = document.getElementById('productDetailTitle');
        const productDetailDescription = document.getElementById('productDetailDescription');
        const productDetailPrice = document.getElementById('productDetailPrice');
        const productDetailImage = document.getElementById('productDetailImage');
        const addToCartDetailButton = document.getElementById('addToCartDetailButton');        
        productDetailTitle.textContent = product.title;
        productDetailDescription.textContent = product.description;
        productDetailPrice.textContent = `Precio: $${product.price}`;
        productDetailImage.src = product.image;
        addToCartDetailButton.disabled = isProductInCart(product.id);    
        addToCartDetailButton.onclick = () => {
            if (!addToCartDetailButton.disabled) {
                const added = addToCart(product);
                if (added) {
                    addToCartDetailButton.disabled = true;
                    Alerts.addProduct()
                }
            }
        };    
        productDetailModal.show();
    }


    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        if (!cart.some(item => item.id === product.id)) {
            product.amount = 1;
            cart.push(product);
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            console.log(product);            
            return true;
        }
        return false;
    }

    
    fetchProducts(category);
});