document.addEventListener('DOMContentLoaded', async ()=>{
    async function loadCategories(){
        const API_BASE_URL = 'https://fakestoreapi.com'
        try {
            const response = await fetch(`${API_BASE_URL}/products/categories`)
            if(!response.ok){
                throw new Error("Error al obtener las categorias");                
            }
            const categories =  await response.json();
            

            const dropdownMenu = document.getElementById('dropdown-categories')
            if(dropdownMenu) {
                dropdownMenu.innerHTML = ''
                categories.forEach(category => {
                    const categoryItem =  document.createElement('li')
                    const categoryLink =  document.createElement('a')
                    categoryLink.classList = 'dropdown-item'
                    categoryLink.href = `index.html?category=${encodeURIComponent(category)}`;
                    categoryLink.textContent = category;
                    categoryItem.appendChild(categoryLink);
                    dropdownMenu.appendChild(categoryItem);

                });
            }
            
            
            
        } catch (error) {
            console.error('Error al cargar las categorias', error)
        }
    }
    


    loadCategories()
})