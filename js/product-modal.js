console.log('Modal script loaded');

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

    // Selecionar o modal existente no DOM
    const modal = document.querySelector('.modalproduct-overlay');
    
    // Preencher dados básicos
    modal.querySelector('.product-name').textContent = product.name;
    modal.querySelector('.main-image').src = product.images[0];
    modal.querySelector('.main-image').alt = product.name;
    modal.querySelector('.metaproduct-description').textContent = product.description;
    modal.querySelector('.current-price').textContent = window.formatPrice(product.price);
    
    if (product.oldPrice) {
        const oldPrice = modal.querySelector('.old-price');
        oldPrice.textContent = window.formatPrice(product.oldPrice);
        oldPrice.style.display = 'inline';
    } else {
        modal.querySelector('.old-price').style.display = 'none';
    }
    
    // Forçar o estilo de exibição para garantir que seja visível
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
    
    // Evita adicionar múltiplos listeners
    if (!modal.hasAttribute('data-events-initialized')) {
        // Configurar evento para botão fechar
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeProductModal);
        }
        
        // Configurar evento para overlay
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeProductModal);
        }
        
        // Marcar que os eventos foram inicializados
        modal.setAttribute('data-events-initialized', 'true');
    }
}

// Função para fechar o modal
function closeProductModal() {
    console.log('Executing modal close');
    const modal = document.querySelector('.modalproduct-overlay');
    
    // Ocultar o modal com estilo
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Adicionar eventos de clique nas imagens dos produtos
document.addEventListener('DOMContentLoaded', () => {
    console.log('Setting up click events');
    
    // Configurar evento de escape para fechar o modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeProductModal();
        }
    });
    
    // Selecionar todas as imagens de produtos e adicionar evento de clique
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
    
    // Inicializar eventos do modal ao carregar
    const modal = document.querySelector('.modalproduct-overlay');
    if (modal) {
        // Inicialmente esconder o modal
        modal.style.display = 'none';
        
        // Configurar evento para botão fechar
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeProductModal);
        }
        
        // Configurar evento para overlay
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeProductModal);
        }
        
        // Marcar como inicializado
        modal.setAttribute('data-events-initialized', 'true');
    }
});