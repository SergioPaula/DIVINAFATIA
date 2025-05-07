// products-config.js - Gerencia as funcionalidades do carrinho e produtos
// Versão corrigida - 2025

// ==================
// FUNÇÕES UTILITÁRIAS
// ==================

// Função para formatar preço em BRL
function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// ==================
// FUNCIONALIDADES DO CARRINHO
// ==================

// Estado global do carrinho - definido como propriedade de window
window.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Função para adicionar produto ao carrinho
function addToCart(productId, quantity = 1) {
    // Encontrar o produto pelo ID nos dados de MENU.bolos
    const product = MENU.bolos.find(p => p.id === productId);

    if (!product) {
        console.error(`Produto com ID ${productId} não encontrado`);
        return;
    }

    // Verificar se o produto já está no carrinho
    const existingItemIndex = window.cartItems.findIndex(item => item.id === productId);

    if (existingItemIndex > -1) {
        // Produto já existe, atualizar quantidade
        window.cartItems[existingItemIndex].quantity += quantity;
    } else {
        // Produto novo, adicionar ao carrinho
        window.cartItems.push({
            id: productId,
            name: product.name,
            price: product.currentPrice,
            image: product.cardImage || './img/PRODUTOS/placeholder.webp', // Usar imagem do card ou placeholder
            quantity: quantity
        });
    }

    // Salvar no localStorage
    saveCartToLocalStorage();

    // Atualizar a interface
    updateCartCount();
    renderCartItems();
    updateCartTotals();

    // Feedback visual para o usuário
    showAddedToCartNotification(product.name);
}

// Função para remover produto do carrinho
function removeFromCart(productId) {
    window.cartItems = window.cartItems.filter(item => item.id !== productId);

    saveCartToLocalStorage();
    updateCartCount();
    renderCartItems();
    updateCartTotals();
}

// Função para atualizar a quantidade de um produto no carrinho
function updateCartItemQuantity(productId, newQuantity) {
    const itemIndex = window.cartItems.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        if (newQuantity <= 0) {
            // Se a quantidade for zero ou negativa, remover o item
            removeFromCart(productId);
        } else {
            // Atualizar a quantidade
            window.cartItems[itemIndex].quantity = newQuantity;
            saveCartToLocalStorage();
            updateCartCount();
            updateCartTotals();
        }
    }
}

// Renderizar os itens do carrinho na interface
function renderCartItems() {
    const cartItemsContainer = document.getElementById('itensCarrinho');

    // Limpar o conteúdo atual
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    if (window.cartItems.length === 0) {
        // Carrinho vazio
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Sua sacola está vazia</p>
                <p class="empty-cart-message">Adicione produtos deliciosos para continuar</p>
            </div>
        `;
        return;
    }

    // Adicionar cada item do carrinho à interface
    window.cartItems.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="items-details">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="price">${formatPrice(item.price)}</p>
                </div>
            </div>
            <div class="items-quantity">
                <div class="item-quantity">
                    <button class="qty-btn minus" data-product="${item.id}">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn plus" data-product="${item.id}">+</button>
                </div>
                <button class="btn-retirar" data-product="${item.id}">
                    <svg class="remove-item">
                        <use href="./img/ICONS/icones-gerais.svg#icon-x" />
                    </svg>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    // Adicionar evento aos botões de adicionar/remover quantidade
    attachCartItemEvents();
}

// Atualizar contador de itens
function updateCartCount() {
    const countElement = document.querySelector('.cart-count');
    if (!countElement) return;

    const totalItems = window.cartItems.reduce((total, item) => total + item.quantity, 0);

    countElement.textContent = totalItems;

    if (totalItems <= 0) {
        countElement.classList.add('empty');
    } else {
        countElement.classList.remove('empty');
    }
    
    // Atualizar também o contador no carrinho flutuante se existir
    const stickyCountElement = document.querySelector('.cart-count-sticky');
    if (stickyCountElement) {
        stickyCountElement.textContent = totalItems;
        
        if (totalItems <= 0) {
            stickyCountElement.classList.add('empty');
        } else {
            stickyCountElement.classList.remove('empty');
        }
    }
}

// Calcular e atualizar os totais do carrinho
function updateCartTotals() {
    const subtotalElement = document.getElementById('lblSubTotal');
    const deliveryElement = document.getElementById('lblValorEntrega');
    const totalElement = document.getElementById('lblValorTotal');

    if (!subtotalElement || !totalElement) return;

    // Calcular subtotal
    const subtotal = window.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    // Definir o valor da entrega (pode ser dinâmico com base no CEP)
    const deliveryValue = subtotal >= 79 ? 0 : 12;

    // Calcular total
    const total = subtotal + deliveryValue;

    // Atualizar os elementos na interface
    subtotalElement.textContent = formatPrice(subtotal);

    if (deliveryElement) {
        if (deliveryValue === 0) {
            deliveryElement.textContent = 'GRÁTIS';
            deliveryElement.style.color = 'var(--color-addcart-01)';
        } else {
            deliveryElement.textContent = `+ ${formatPrice(deliveryValue)}`;
            deliveryElement.style.color = '';
        }
    }

    totalElement.textContent = formatPrice(total);

    // Habilitar/desabilitar botão de próximo passo com base no subtotal
    const nextButton = document.querySelector('.btn-next');
    if (nextButton) {
        nextButton.disabled = subtotal <= 0;
    }
}

// Salvar o carrinho no localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(window.cartItems));
}

// Limpar o carrinho
function clearCart() {
    window.cartItems = [];
    saveCartToLocalStorage();
    updateCartCount();
    renderCartItems();
    updateCartTotals();
}

// Mostrar notificação de produto adicionado
function showAddedToCartNotification(productName) {
    // Verificar se já existe uma notificação
    let notification = document.querySelector('.cart-notification');

    if (!notification) {
        // Criar elemento de notificação
        notification = document.createElement('div');
        notification.className = 'cart-notification';
        document.body.appendChild(notification);
    }

    // Atualizar o conteúdo
    notification.innerHTML = `
        <div class="notification-icon">
            <svg class="success-icon">
                <use href="./img/ICONS/icones-gerais.svg#icon-check" />
            </svg>
        </div>
        <div class="notification-content">
            <p><strong>${productName}</strong> <br>adicionado à sacola com sucesso!</p>
        </div>
    `;

    // Mostrar notificação
    notification.classList.add('active');

    // Esconder após 3 segundos
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// Adicionar eventos aos itens do carrinho
function attachCartItemEvents() {
    // Botões de quantidade
    document.querySelectorAll('.cart-item .qty-btn.minus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.product);
            const quantityElement = button.nextElementSibling;
            let quantity = parseInt(quantityElement.textContent);
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
                updateCartItemQuantity(productId, quantity);
            }
        });
    });

    document.querySelectorAll('.cart-item .qty-btn.plus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.product);
            const quantityElement = button.previousElementSibling;
            let quantity = parseInt(quantityElement.textContent);
            quantity++;
            quantityElement.textContent = quantity;
            updateCartItemQuantity(productId, quantity);
        });
    });

    // Botões de remover item
    document.querySelectorAll('.btn-retirar').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.product);
            removeFromCart(productId);
        });
    });
}

// ==================
// CONTROLES DE QUANTIDADE
// ==================

// Configurar controles de quantidade (versão corrigida)
function setupQuantityControls(container) {
    if (!container) return;

    // Verificar se o container já foi inicializado
    if (container.dataset.initialized === "true") {
        return; // Evita múltiplas inicializações
    }

    const minusBtn = container.querySelector('.minus');
    const plusBtn = container.querySelector('.plus');
    const displayElement = container.querySelector('.qty-display');

    if (!minusBtn || !plusBtn || !displayElement) return;

    // Remover event listeners existentes
    const newMinusBtn = minusBtn.cloneNode(true);
    const newPlusBtn = plusBtn.cloneNode(true);
    
    minusBtn.parentNode.replaceChild(newMinusBtn, minusBtn);
    plusBtn.parentNode.replaceChild(newPlusBtn, plusBtn);

    // Adicionar novos event listeners
    newMinusBtn.addEventListener('click', () => {
        let quantity = parseInt(displayElement.textContent);
        if (quantity > 1) {
            quantity--;
            displayElement.textContent = quantity;
        }
        newMinusBtn.disabled = quantity <= 1;
    });

    newPlusBtn.addEventListener('click', () => {
        let quantity = parseInt(displayElement.textContent);
        quantity++;
        displayElement.textContent = quantity;
        newMinusBtn.disabled = false;
    });

    // Marcar como inicializado
    container.dataset.initialized = "true";
}

// Configurar botões "Adicionar à Sacola" em todos os cards de produto
function setupAddToCartButtons() {
    // Selecionar todos os botões "Adicionar à Sacola" nos cards
    document.querySelectorAll('.add-to-cart').forEach(button => {
        // Verificar se o botão já foi inicializado
        if (button.dataset.initialized === "true") {
            return; // Evita múltiplas inicializações
        }

        button.addEventListener('click', (e) => {
            // Evitar comportamento padrão do botão
            e.preventDefault();

            // Obter ID do produto do atributo data-product
            const productId = parseInt(button.dataset.product);

            // Obter a quantidade selecionada
            const quantityElement = button.closest('.purchase-controls').querySelector('.qty-display');
            const quantity = parseInt(quantityElement.textContent);

            // Adicionar o produto ao carrinho
            addToCart(productId, quantity);
        });

        // Marcar como inicializado
        button.dataset.initialized = "true";
    });
}

// ==================
// MODAL DE PRODUTO
// ==================

// Inicializar o modal
function initModal() {
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
    
    // Configurar navegação por abas no modal
    setupModalTabs();
    
    // Adicionar event listeners aos cards de produtos
    attachProductCardListeners();
}

// Adicionar event listeners aos cards de produtos
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
                showProductModal(productId);
            }
        });
        
        // Marcar como inicializado
        card.dataset.listenerAttached = 'true';
    });
}

// Mostrar o modal de produto
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

        // Verificar se o botão já foi inicializado
        if (addToCartButton.dataset.initialized !== "true") {
            addToCartButton.addEventListener('click', () => {
                const productId = parseInt(addToCartButton.dataset.product);
                const quantity = parseInt(productModal.querySelector('.qty-display').textContent);

                // Adicionar ao carrinho
                addToCart(productId, quantity);

                // Fechar o modal
                closeProductModal();
            });

            // Marcar como inicializado
            addToCartButton.dataset.initialized = "true";
        }
    }

    // Configurar controles de quantidade no modal
    setupQuantityControls(productModal.querySelector('.quantity'));
}

// Fechar o modal de produto
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
            oldPrice.textContent = formatPrice(product.oldPrice);
            oldPrice.style.display = 'inline-block';
        } else {
            oldPrice.style.display = 'none';
        }
    }
    
    if (currentPrice) {
        currentPrice.textContent = formatPrice(product.currentPrice);
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

// ==================
// INICIALIZAÇÃO
// ==================

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar o carrinho
    updateCartCount();
    renderCartItems();
    updateCartTotals();

    // Configurar controles de quantidade em todos os cards
    document.querySelectorAll('.quantity').forEach(container => {
        setupQuantityControls(container);
    });

    // Configurar botões de adicionar à sacola
    setupAddToCartButtons();

    // Inicializar o modal
    initModal();
});

// Expor funções para uso global
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.renderCartItems = renderCartItems;
window.clearCart = clearCart;
window.formatPrice = formatPrice;
window.updateCartCount = updateCartCount;
window.updateCartTotals = updateCartTotals;
window.showProductModal = showProductModal;
window.closeProductModal = closeProductModal;
window.setupQuantityControls = setupQuantityControls;
window.showSuccessMessage = showAddedToCartNotification;