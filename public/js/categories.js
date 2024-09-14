document.addEventListener('DOMContentLoaded', async () => {
    async function loadCategories() {
        const API_BASE_URL = 'https://fakestoreapi.com';
        try {
            const response = await fetch(`${API_BASE_URL}/products/categories`);
            if (!response.ok) {
                throw new Error('Error al obtener las categorías');
            }
            const categories = await response.json();
            const categoriesContainer = document.getElementById('categories_container');
            if (categoriesContainer) {
                categoriesContainer.innerHTML = '';
                categories.forEach(category => {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'card';
                    categoryDiv.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title text-center">${category}</h5>
                            <a href="index.html?category=${encodeURIComponent(category)}" class="btn btn-primary d-block">Ver Productos</a>
                        </div>
                    `;
                    categoriesContainer.appendChild(categoryDiv);
                });
            }
            const dropdownMenu = document.getElementById('dropdown-categories');
            if (dropdownMenu) {
                dropdownMenu.innerHTML = '';
                categories.forEach(category => {
                    const categoryItem = document.createElement('li');
                    const categoryLink = document.createElement('a');
                    categoryLink.className = 'dropdown-item';
                    categoryLink.href = `index.html?category=${encodeURIComponent(category)}`;
                    categoryLink.textContent = category;
                    categoryItem.appendChild(categoryLink);
                    dropdownMenu.appendChild(categoryItem);
                });
            }    
        } catch (error) {
            console.error('Error al cargar las categorías:', error);
        }
    }
    loadCategories();
});