// product-modal.js - Gerenciamento do modal de produto
// Versão modificada para usar os dados do arquivo dados.js

document.addEventListener('DOMContentLoaded', () => {
    // Elementos do modal
    const productModal = document.querySelector('.modalproduct-overlay');
    if (!productModal) return;

    const closeButton = productModal.querySelector('.modal-close');
    
    // Configurar botão de fechar
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            closeProductModal();
        });
    }
    
    // Fechar ao clicar fora do modal
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeProductModal();
        }
    });
    
    // Configurar botão de adicionar ao carrinho no modal
    const addToCartButton = productModal.querySelector('.add-to-cartproduct');
    if (addToCartButton && !addToCartButton.dataset.initialized) {
        addToCartButton.addEventListener('click', () => {
            const productId = parseInt(addToCartButton.dataset.product);
            const quantity = parseInt(productModal.querySelector('.qty-display').textContent);
            
            // Adicionar ao carrinho
            if (typeof window.addToCart === 'function') {
                window.addToCart(productId, quantity);
            }
            
            // Fechar o modal
            closeProductModal();
        });
        
        // Marcar como inicializado
        addToCartButton.dataset.initialized = "true";
    }
    
    // Configurar navegação por abas no modal
    setupModalTabs();
    
    // Adicionar event listeners aos cards de produtos
    attachProductCardListeners();
    
    // Também adicionar um observer para detectar novos produtos adicionados
    const observer = new MutationObserver((mutations) => {
        attachProductCardListeners();
    });
    
    const productContainer = document.getElementById('itensCardapio');
    if (productContainer) {
        observer.observe(productContainer, { 
            childList: true,
            subtree: true 
        });
    }
});

// Função para adicionar event listeners aos cards de produtos
function attachProductCardListeners() {
    // Selecionar todos os cards clicáveis
    const productCards = document.querySelectorAll('.product-card .card-clickable, .product-card .card-image');
    
    productCards.forEach(card => {
        // Verificar se o card já tem um listener (para evitar duplicação)
        if (card.dataset.listenerAttached === 'true') return;
        
        card.addEventListener('click', (e) => {
            // Não abrir o modal se clicar nos controles de quantidade ou botão de compra
            if (e.target.closest('.purchase-controls')) {
                return;
            }
            
            // Obter o ID do produto do card pai
            const productCard = card.closest('.product-card');
            const productId = parseInt(productCard.dataset.id);
            
            // Verificar se temos um ID válido
            if (productId) {
                console.log('Abrindo modal para o produto:', productId);
                showProductModal(productId);
            } else {
                console.error('ID do produto não encontrado no card');
            }
        });
        
        // Marcar como inicializado
        card.dataset.listenerAttached = 'true';
    });
}

// Função para mostrar o modal de produto
function showProductModal(productId) {
    // Encontrar o produto nos dados do MENU.bolos pelo ID 
    const product = MENU.bolos.find(p => p.id === productId);
    
    if (!product) {
        console.error(`Produto com ID ${productId} não encontrado`);
        return;
    }
    
    const productModal = document.querySelector('.modalproduct-overlay');
    if (!productModal) return;
    
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
    
    // Configurar os controles de quantidade no modal
    setupModalQuantityControls(productModal.querySelector('.quantity'));
}

// Função para fechar o modal de produto
function closeProductModal() {
    const productModal = document.querySelector('.modalproduct-overlay');
    if (productModal) {
        productModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

// Preencher os detalhes do produto no modal
function populateProductModal(product) {
    const modal = document.querySelector('.modalproduct-overlay');
    if (!modal) return;
    
    // Imagem principal
    const mainImage = modal.querySelector('.main-image');
    if (mainImage) {
        // Usar a imagem do card ou uma imagem padrão se não houver
        mainImage.src = product.cardImage || './img/PRODUTOS/placeholder.webp';
        mainImage.alt = product.name;
    }
    
    // Nome do produto
    const productName = modal.querySelector('.product-name');
    if (productName) {
        productName.textContent = product.name;
    }
    
    // Avaliações
    const ratingContainer = modal.querySelector('.rating');
    if (ratingContainer && product.rating !== undefined) {
        // Limpar estrelas existentes
        const starsContainer = ratingContainer.querySelectorAll('svg');
        starsContainer.forEach(star => star.remove());
        
        // Criar estrelas baseadas na avaliação
        for (let i = 1; i <= 5; i++) {
            const starSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            if (i <= Math.floor(product.rating)) {
                // Estrela cheia
                starSvg.innerHTML = '<use href="./img/ICONS/icones-gerais.svg#star-full"></use>';
            } else if (i - 0.5 <= product.rating) {
                // Estrela meio cheia
                starSvg.innerHTML = '<use href="./img/ICONS/icones-gerais.svg#star-half"></use>';
            } else {
                // Estrela vazia
                starSvg.classList.add('star-line');
                starSvg.innerHTML = '<use href="./img/ICONS/icones-gerais.svg#star-line"></use>';
            }
            
            // Inserir antes do texto de avaliações
            const reviewsText = ratingContainer.querySelector('.avaliacoes');
            if (reviewsText) {
                ratingContainer.insertBefore(starSvg, reviewsText);
            } else {
                ratingContainer.appendChild(starSvg);
            }
        }
        
        // Atualizar contagem de avaliações
        const reviewsCount = ratingContainer.querySelector('.avaliacoes');
        if (reviewsCount) {
            reviewsCount.textContent = `${product.reviewCount} Avaliações`;
        }
    }
    
    // Descrição
    const description = modal.querySelector('.metaproduct-description');
    if (description) {
        description.textContent = product.metaDescription || '';
    }
    
    // Peso e porções
    const pesoRende = modal.querySelector('.peso-rende');
    if (pesoRende) {
        const pesoSpan = pesoRende.querySelector('p:first-child span');
        const rendeSpan = pesoRende.querySelector('p:last-child span');
        
        if (pesoSpan) {
            pesoSpan.textContent = product.weight || '';
        }
        
        if (rendeSpan) {
            rendeSpan.textContent = product.servings || '';
        }
    }
    
    // Selos/ícones
    const selosContainer = modal.querySelector('.selos-modalproduto');
    if (selosContainer && product.icons) {
        // Limpar selos existentes
        selosContainer.innerHTML = '';
        
        // Adicionar novos selos
        if (product.icons.length > 0) {
            if (product.icons[0] && product.icons[0].firstText && product.icons[0].firstIcon) {
                selosContainer.innerHTML += `
                <div>
                    <svg class="icon-selos">
                        <use href="./img/ICONS/icons-selos.svg#${product.icons[0].firstIcon}"></use>
                    </svg>
                    <p>${product.icons[0].firstText.replace(/\s+/g, '<br>')}</p>
                </div>`;
            }
            
            if (product.icons[1] && product.icons[1].secondText && product.icons[1].secondIcon) {
                selosContainer.innerHTML += `
                <div>
                    <svg class="icon-selos">
                        <use href="./img/ICONS/icons-selos.svg#${product.icons[1].secondIcon}"></use>
                    </svg>
                    <p>${product.icons[1].secondText.replace(/\s+/g, '<br>')}</p>
                </div>`;
            }
            
            if (product.icons[2] && product.icons[2].thirdText && product.icons[2].thirdIcon) {
                selosContainer.innerHTML += `
                <div>
                    <svg class="icon-selos">
                        <use href="./img/ICONS/icons-selos.svg#${product.icons[2].thirdIcon}"></use>
                    </svg>
                    <p>${product.icons[2].thirdText.replace(/\s+/g, '<br>')}</p>
                </div>`;
            }
        }
    }
    
    // Preço
    const oldPrice = modal.querySelector('.old-price');
    const currentPrice = modal.querySelector('.current-price');
    
    if (oldPrice) {
        if (product.oldPrice) {
            if (typeof window.formatPrice === 'function') {
                oldPrice.textContent = window.formatPrice(product.oldPrice);
            } else {
                oldPrice.textContent = `R$ ${product.oldPrice.toFixed(2).replace('.', ',')}`;
            }
            oldPrice.style.display = 'inline-block';
        } else {
            oldPrice.style.display = 'none';
        }
    }
    
    if (currentPrice) {
        if (typeof window.formatPrice === 'function') {
            currentPrice.textContent = window.formatPrice(product.currentPrice);
        } else {
            currentPrice.textContent = `R$ ${product.currentPrice.toFixed(2).replace('.', ',')}`;
        }
    }
    
    // Conteúdo detalhado para as abas
    updateModalTabContent(product);
}

// Atualizar o conteúdo das abas do modal
function updateModalTabContent(product) {
    const modal = document.querySelector('.modalproduct-overlay');
    if (!modal) return;
    
    // Descrição detalhada
    const descricaoConteudo = modal.querySelector('#descricao-conteudo');
    if (descricaoConteudo) {
        // Se houver uma descrição detalhada definida, usar ela, caso contrário usar a descrição normal
        const detailedDescription = product.details?.fullDescription || product.metaDescription;
        
        const descParagraph = descricaoConteudo.querySelector('.txt-1 p');
        if (descParagraph) {
            // Incluir o nome do produto na descrição
            descParagraph.innerHTML = `O <strong>${product.name}</strong> ${detailedDescription || ''}`;
        }
        
        // Atualizar título se presente
        const descTitle = descricaoConteudo.querySelector('.txt-1 h2');
        if (descTitle) {
            descTitle.textContent = `Experimente o ${product.name}`;
        }
    }
    
    // Ingredientes
    const ingredientesConteudo = modal.querySelector('#ingredientes-conteudo');
    if (ingredientesConteudo) {
        const ingredientsParagraph = ingredientesConteudo.querySelector('.txt-2 p');
        if (ingredientsParagraph) {
            // Usar os ingredientes detalhados se houver, ou um texto padrão
            ingredientsParagraph.textContent = product.details?.ingredients || 
                'Farinha de trigo, açúcar, ovos, leite, manteiga, fermento químico e outros ingredientes selecionados.';
        }
    }
    
    // Alérgicos
    const alergicosConteudo = modal.querySelector('#alergicos-conteudo');
    if (alergicosConteudo) {
        const alergicosParagraph = alergicosConteudo.querySelector('.txt-2 p');
        if (alergicosParagraph) {
            // Usar os dados de alérgenos se disponíveis, ou um texto padrão
            const alergenosText = product.details?.allergens || 
                'Contém glúten. Contém lactose. Pode conter traços de oleaginosas (nozes, castanhas, amêndoas).';
            
            alergicosParagraph.textContent = alergenosText;
        }
    }
    
    // Validade
    const validadeConteudo = modal.querySelector('#validade-conteudo');
    if (validadeConteudo) {
        const validadeParagraph = validadeConteudo.querySelector('.txt-2 p');
        if (validadeParagraph) {
            // Usar os dados de validade se disponíveis, ou um texto padrão
            const validadeText = product.details?.validity || '5 dias em refrigeração';
            
            validadeParagraph.innerHTML = `<strong>${validadeText}</strong>. Para melhor experiência, consumir em temperatura ambiente. Para preservar todo o sabor e maciez, mantenha o bolo em recipiente fechado na geladeira e retire 30 minutos antes de servir.`;
        }
    }
}

// Configurar os controles de quantidade (+ e -) no modal
function setupModalQuantityControls(container) {
    if (!container) return;
    
    // Remover os botões antigos e substituir por novos
    const oldMinusBtn = container.querySelector('.minus');
    const oldPlusBtn = container.querySelector('.plus');
    const displayElement = container.querySelector('.qty-display');
    
    if (!oldMinusBtn || !oldPlusBtn || !displayElement) return;
    
    // Clonar e substituir para remover event listeners antigos
    const minusBtn = oldMinusBtn.cloneNode(true);
    const plusBtn = oldPlusBtn.cloneNode(true);
    
    oldMinusBtn.replaceWith(minusBtn);
    oldPlusBtn.replaceWith(plusBtn);
    
    // Configurar novos event listeners
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
    if (!modal) return;
    
    const menuItems = modal.querySelectorAll('.nav-itemmodal a');
    if (!menuItems.length) return;

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
window.setupModalQuantityControls = setupModalQuantityControls;