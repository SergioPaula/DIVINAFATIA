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

    // Selecionar o modal existente no HTML
    const modal = document.querySelector('.modal-overlay');
    
    // Preencher dados do produto no modal
    if (modal) {
        // Preencher os dados do produto no modal
        modal.querySelector('.main-image').src = product.images[0];
        modal.querySelector('.main-image').alt = product.name;
        modal.querySelector('.product-name').textContent = product.name;
        
        // Preencher a descrição do produto
        const metaDescription = modal.querySelector('.metaproduct-description');
        if (metaDescription) {
            metaDescription.textContent = product.detailedDescription || product.description;
        }
        
        // Preencher preços
        const currentPrice = modal.querySelector('.current-price');
        const oldPrice = modal.querySelector('.old-price');
        
        if (currentPrice) {
            currentPrice.textContent = window.formatPrice(product.price);
        }
        
        if (oldPrice && product.oldPrice) {
            oldPrice.textContent = window.formatPrice(product.oldPrice);
            oldPrice.style.display = 'inline-block';
        } else if (oldPrice) {
            oldPrice.style.display = 'none';
        }
        
        // Avaliações
        const rating = modal.querySelector('.rating');
        if (rating && product.rating) {
            // Aqui você pode implementar o preenchimento das estrelas de avaliação
            const avaliacoes = rating.querySelector('.avaliacoes');
            if (avaliacoes) {
                avaliacoes.textContent = `${product.reviewCount || 0} Avaliações`;
            }
        }
        
        // Configurar o botão "Adicionar à Sacola"
        const addToCartButton = modal.querySelector('.add-to-cart');
        if (addToCartButton) {
            addToCartButton.setAttribute('data-product', productId);
        }
        
        // Configurar controles de quantidade
        const quantityContainer = modal.querySelector('.quantity');
        if (quantityContainer) {
            window.setupQuantityControls(quantityContainer);
        }
        
        // Mostrar o modal
        modal.showModal();
        
        // Adicionar eventos de fechar
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.close();
            });
        }
    } else {
        console.error('Modal element not found in the HTML');
    }
}

// Adicionar eventos de clique nas imagens dos produtos
document.addEventListener('DOMContentLoaded', () => {
    console.log('Setting up click events');
    
    // Selecionar o modal
    const modal = document.querySelector('.modal-overlay');
    
    // Adicionar evento de fechar ao botão de fechar
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.close();
        });
    }
    
    // Adicionar eventos de clique nas imagens dos produtos
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