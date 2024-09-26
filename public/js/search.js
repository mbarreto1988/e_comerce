document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://fakestoreapi.com';
    const searchInput = document.querySelector('input[type="search"]');
    const cardProduct = document.getElementById('card_product');


    
    async function fetchProducts() {  // esta funcion trae todos los productos de la api
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return [];
        }
    }
    

    function displayProducts(products) {
        cardProduct.innerHTML = '';
        if (products.length === 0) {
            const noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'alert alert-primary d-flex align-items-center';
            noResultsMessage.role = 'alert';
    
            noResultsMessage.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <div>
                    El producto seleccionado no existe.
                </div>
            `;
            
            cardProduct.appendChild(noResultsMessage);
        } else {
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'card mb-3';
                productDiv.innerHTML = `
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${product.image}" class="img-fluid rounded-start" alt="${product.title}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${product.title}</h5>
                                <p class="card-text">$${product.price}</p>
                                <button class="btn btn-primary view-details-btn" data-id="${product.id}">Ver Detalles</button>
                            </div>
                        </div>
                    </div>
                `;
                cardProduct.appendChild(productDiv);
            });
    
            // Añadir eventos a los botones de "Ver Detalles"
            document.querySelectorAll('.view-details-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const productId = e.target.dataset.id;
                    const product = await fetchProductById(productId);
                    showProductDetails(product);
                });
            });
        }
    }
    

    async function fetchProductById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            return null;
        }
    }

    function showProductDetails(product) { // es la funcion que abre el modal con el detalle del producto
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
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Producto Agregado al Carrito',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        };    
        productDetailModal.show();
    }

    function isProductInCart(productId) {  //la funcion que busca el producto en el LocalStorage y retorna true o false
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        return cart.some(product => product.id === productId);
    }

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const existingProductIndex = cart.findIndex(item => item.id === product.id);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].amount += 1;
        } else {
            product.amount = 1;
            cart.push(product);
        }

        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        console.log('Producto agregado al carrito:', product);
        return true;
    }



    // esta ya esta
    async function handleSearch() {
        const query = searchInput.value.toLowerCase();
        const products = await fetchProducts();
        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(query)
        );
        displayProducts(filteredProducts);
    }

    searchInput.addEventListener('input', handleSearch);
});
