document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://fakestoreapi.com'
    const urlParams = new URLSearchParams('category')
    const category = urlParams.get('category')

    async function fetchProducts(category = ''){
        try {
            let url = `${API_BASE_URL}/products`;
            if(category){
                url = `${url}/category/${encodeURIComponent(category)}`;
            }

            const response = await fetch(url)
            if(!response.ok){
                throw new Error('Error en la respuesta de la api')
            }
            const products = await response.json()
            const card_product = document.getElementById('card_product')
            card_product.innerHTML = ''
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'card';
                productDiv.innerHTML = `
                    <img src='${product.image}' alt='' class='card-img-top'>
                    <div class'card-content'>
                        <h5 class'card-title'> ${product.title} </h5>
                        <a href'#' class='btn btn-primary view-details-btn' data-id='${product.id}'> ver detalle </a>
                    </div>
                
                `;
                card_product.appendChild(productDiv)
            });


        } catch (error) {
            console.error('Error al obtener los productos', error)
        }
    }


    fetchProducts(category)

})