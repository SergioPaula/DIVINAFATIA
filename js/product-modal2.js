// product-modal.js - Gerenciamento do modal de produto

document.addEventListener('DOMContentLoaded', () => {
    // Elementos do modal
    const productModal = document.querySelector('.modalproduct-overlay');
    const closeButton = productModal.querySelector('.modal-close');
    
    // Configurar botão de fechar
    closeButton.addEventListener('click', () => {
        closeProductModal();
    });
    
    // Fechar ao clicar fora do modal
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeProductModal();
        }
    });
    
    // Escutar cliques nas imagens dos produtos
    document.querySelectorAll('.product-card .card-image').forEach(imageContainer => {
        imageContainer.addEventListener('click', () => {
            const productCard = imageContainer.closest('.product-card');
            const productId = parseInt(productCard.querySelector('.add-to-cart').dataset.product);
            showProductModal(productId);
        });
    });
    
    // Inicializar controles de quantidade no modal
    setupQuantityControls(productModal.querySelector('.quantity'));
    
    // Configurar botão de adicionar ao carrinho no modal
    const addToCartButton = productModal.querySelector('.add-to-cartproduct');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            const productId = parseInt(addToCartButton.dataset.product);
            const quantity = parseInt(productModal.querySelector('.qty-display').textContent);
            
            // Adicionar ao carrinho
            addToCart(productId, quantity);
            
            // Fechar o modal
            closeProductModal();
        });
    }
    
    // Configurar navegação por abas no modal
    setupModalTabs();
});

// Função para mostrar o modal de produto
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error(`Produto com ID ${productId} não encontrado`);
        return;
    }
    
    const productModal = document.querySelector('.modalproduct-overlay');
    
    // Preencher os detalhes do produto no modal
    populateProductModal(product);
    
    // Mostrar o modal
    productModal.style.display = 'block';
    document.body.classList.add('modal-open');
    
    // Resetar quantidade
    const quantityDisplay = productModal.querySelector('.qty-display');
    if (quantityDisplay) {
        quantityDisplay.textContent = '1';
    }
    
    // Configurar botão de adicionar ao carrinho
    const addToCartButton = productModal.querySelector('.add-to-cartproduct');
    if (addToCartButton) {
        addToCartButton.dataset.product = productId;
    }
}

// Função para fechar o modal de produto
function closeProductModal() {
    const productModal = document.querySelector('.modalproduct-overlay');
    productModal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Preencher os detalhes do produto no modal
function populateProductModal(product) {
    const modal = document.querySelector('.modalproduct-overlay');
    
    // Imagem principal
    const mainImage = modal.querySelector('.main-image');
    if (mainImage && product.images && product.images.length > 0) {
        mainImage.src = product.images[0];
        mainImage.alt = product.name;
    }
    
    // Nome do produto
    const productName = modal.querySelector('.product-name');
    if (productName) {
        productName.textContent = product.name;
    }
    
    // Avaliações
    const ratingContainer = modal.querySelector('.rating');
    if (ratingContainer) {
        // Pode implementar lógica de exibição de estrelas baseada no product.rating
        const reviewsCount = ratingContainer.querySelector('.avaliacoes');
        if (reviewsCount && product.reviewCount) {
            reviewsCount.textContent = `${product.reviewCount} Avaliações`;
        }
    }
    
    // Descrição
    const description = modal.querySelector('.metaproduct-description');
    if (description) {
        description.textContent = product.description;
    }
    
    // Especificações
    if (product.specifications) {
        const pesoRende = modal.querySelector('.peso-rende');
        if (pesoRende) {
            const pesoSpan = pesoRende.querySelector('p:first-child span');
            const rendeSpan = pesoRende.querySelector('p:last-child span');
            
            if (pesoSpan && product.specifications.weight) {
                pesoSpan.textContent = product.specifications.weight;
            }
            
            if (rendeSpan && product.specifications.serves) {
                const fatias = product.specifications.serves.split(' ')[0];
                rendeSpan.textContent = fatias;
            }
        }
    }
    
    // Preço
    const oldPrice = modal.querySelector('.old-price');
    const currentPrice = modal.querySelector('.current-price');
    
    if (oldPrice && product.oldPrice) {
        oldPrice.textContent = formatPrice(product.oldPrice);
        oldPrice.style.display = 'inline-block';
    } else if (oldPrice) {
        oldPrice.style.display = 'none';
    }
    
    if (currentPrice) {
        currentPrice.textContent = formatPrice(product.price);
    }
    
    // Conteúdo detalhado
    populateDetailedContent(product);
}

// Preencher o conteúdo detalhado nas abas
function populateDetailedContent(product) {
    const modal = document.querySelector('.modalproduct-overlay');
    
    // Descrição detalhada
    const descricaoConteudo = modal.querySelector('#descricao-conteudo');
    if (descricaoConteudo && product.detailedDescription) {
        const descParagraphs = descricaoConteudo.querySelectorAll('p');
        if (descParagraphs.length > 0) {
            descParagraphs[0].innerHTML = product.detailedDescription;
        }
    }
    
    // Ingredientes
    const ingredientesConteudo = modal.querySelector('#ingredientes-conteudo');
    if (ingredientesConteudo && product.ingredients) {
        const ingredientsParagraph = ingredientesConteudo.querySelector('.txt-2 p');
        if (ingredientsParagraph) {
            ingredientsParagraph.textContent = product.ingredients;
        }
    }
    
    // Alérgicos
    const alergicosConteudo = modal.querySelector('#alergicos-conteudo');
    if (alergicosConteudo && product.allergens) {
        const alergicosParagraph = alergicosConteudo.querySelector('.txt-2 p');
        if (alergicosParagraph) {
            let alergicosText = '';
            
            if (product.allergens.gluten) {
                alergicosText += 'Contém glúten. ';
            } else {
                alergicosText += 'Não contém glúten. ';
            }
            
            if (product.allergens.lactose) {
                alergicosText += 'Contém lactose. ';
            } else {
                alergicosText += 'Não contém lactose. ';
            }
            
            if (product.allergens.nuts) {
                alergicosText += 'Contém oleaginosas (nozes, castanhas, amêndoas).';
            } else {
                alergicosText += 'Pode conter traços de oleaginosas (nozes, castanhas, amêndoas).';
            }
            
            alergicosParagraph.textContent = alergicosText;
        }
    }
    
    // Validade
    const validadeConteudo = modal.querySelector('#validade-conteudo');
    if (validadeConteudo && product.specifications && product.specifications.storage) {
        const validadeParagraph = validadeConteudo.querySelector('.txt-2 p');
        if (validadeParagraph) {
            validadeParagraph.innerHTML = `<strong>${product.specifications.storage}</strong>. Para melhor experiência, consumir em temperatura ambiente. Para preservar todo o sabor e maciez, mantenha o bolo em recipiente fechado na geladeira e retire 30 minutos antes de servir.`;
        }
    }
}

// Configurar os controles de quantidade (+ e -)
function setupQuantityControls(container) {
    if (!container) return;
    
    const minusBtn = container.querySelector('.minus');
    const plusBtn = container.querySelector('.plus');
    const displayElement = container.querySelector('.qty-display');
    
    if (!minusBtn || !plusBtn || !displayElement) return;
    
    minusBtn.addEventListener('click', () => {
        let quantity = parseInt(displayElement.textContent);
        if (quantity > 1) {
            quantity--;
            displayElement.textContent = quantity;
        }
        minusBtn.disabled = quantity <= 1;
    });
    
    plusBtn.addEventListener('click', () => {
        let quantity = parseInt(displayElement.textContent);
        quantity++;
        displayElement.textContent = quantity;
        minusBtn.disabled = false;
    });
}

// Configurar a navegação por abas no modal
function setupModalTabs() {
    const modal = document.querySelector('.modalproduct-overlay');
    const menuItems = modal.querySelectorAll('.nav-itemmodal a');
    
    // Esconder todos os conteúdos das abas, exceto o primeiro
    const contents = modal.querySelectorAll('[id$="-conteudo"]');
    contents.forEach((content, index) => {
        if (index > 0) {
            content.style.display = 'none';
        }
    });
    
    // Adicionar eventos aos links do menu
    menuItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Obter o ID do conteúdo a ser mostrado
            const targetId = item.getAttribute('href').substring(1) + '-conteudo';
            
            // Esconder todos os conteúdos
            contents.forEach((content) => {
                content.style.display = 'none';
            });
            
            // Mostrar o conteúdo correspondente
            const targetContent = modal.querySelector(`#${targetId}`);
            if (targetContent) {
                targetContent.style.display = 'flex';
            }
            
            // Atualizar a classe ativa nos links
            menuItems.forEach((menuItem) => {
                menuItem.classList.remove('active');
            });
            item.classList.add('active');
        });
    });
}

// Tornar funções globais para serem acessadas por outros scripts
window.showProductModal = showProductModal;
window.closeProductModal = closeProductModal;
window.setupQuantityControls = setupQuantityControls;