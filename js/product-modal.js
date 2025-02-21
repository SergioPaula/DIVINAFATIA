console.log('Modal script loaded');

// Estrutura expandida dos produtos já definida em products-config.js

// Função para criar o modal
function createProductModal() {
    console.log('Creating modal');
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-body">
                <div class="modal-image-gallery">
                    <img src="" alt="" class="main-image">
                </div>
                <div class="modal-info">
                    <div class="modal-header">
                        <h2 class="product-name"></h2>
                    </div>
                    <div class="product-description"></div>
                    <div class="product-price">
                        <span class="current-price"></span>
                    </div>
                </div>
            </div>
        </div>
    `;

    return modal;
}

// Função para mostrar o modal com os dados do produto
function showProductModal(productId) {
    console.log('Showing modal for product:', productId);
    
    // Encontrar o produto
    const product = window.products.find(p => p.id === productId);
    console.log('Product found:', product);
    
    if (!product) {
        console.error('Product not found');
        return;
    }

    const modal = createProductModal();
    document.body.appendChild(modal);
    
    // Preencher dados básicos primeiro
    modal.querySelector('.product-name').textContent = product.name;
    modal.querySelector('.main-image').src = product.images[0];
    modal.querySelector('.main-image').alt = product.name;
    modal.querySelector('.product-description').textContent = product.description;
    modal.querySelector('.current-price').textContent = window.formatPrice(product.price);
    
    // Adicionar evento de fechar
    modal.querySelector('.modal-close').addEventListener('click', () => {
        console.log('Closing modal');
        modal.remove();
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        console.log('Closing modal from overlay');
        modal.remove();
    });
}

// Adicionar eventos de clique nas imagens dos produtos
document.addEventListener('DOMContentLoaded', () => {
    console.log('Setting up click events');
    
    const productImages = document.querySelectorAll('.card-image');
    productImages.forEach(imageContainer => {
        const productCard = imageContainer.closest('.product-card');
        if (productCard) {
            const addToCartButton = productCard.querySelector('.add-to-cart');
            if (addToCartButton) {
                const productId = parseInt(addToCartButton.dataset.product);
                
                imageContainer.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Image clicked for product:', productId);
                    showProductModal(productId);
                });
            }
        }
    });
});