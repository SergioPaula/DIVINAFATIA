// cart.js - Sistema de gerenciamento do carrinho de compras

// Estado global do carrinho
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Função que é executada quando o DOM é carregado
document.addEventListener('DOMContentLoaded', () => {
    // Elementos do carrinho
    const cartModal = document.getElementById('cartModal');
    const cartButton = document.querySelector('.cart-button');
    const closeButton = cartModal.querySelector('.close-modal-cart');
    const overlay = cartModal.querySelector('.modal-overlay');
    const nextButton = cartModal.querySelector('.btn-next');
    const backButton = cartModal.querySelector('.btn-back');
    const cartCountElement = document.querySelector('.cart-count');
    
    let currentStep = 1;

    // Inicializar o carrinho
    initCart();

    // Abrir modal do carrinho
    cartButton.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.classList.add('active');
        updateStep(1);
    });

    // Fechar modal
    function closeModal() {
        cartModal.classList.remove('active');
    }

    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Atualizar passo atual
    function updateStep(step) {
        const steps = cartModal.querySelectorAll('.step');
        const contents = cartModal.querySelectorAll('.step-content');
        
        steps.forEach(s => s.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        steps[step - 1].classList.add('active');
        contents[step - 1].classList.add('active');
        
        // Atualizar visibilidade dos botões
        backButton.hidden = step === 1;
        nextButton.textContent = step === 3 ? 'Finalizar Pedido' : 'Continuar';
        
        currentStep = step;
    }

    // Navegação entre passos
    nextButton.addEventListener('click', () => {
        if (currentStep < 3) {
            updateStep(currentStep + 1);
        } else {
            // Lógica para finalizar o pedido
            sendOrderToWhatsApp();
        }
    });

    backButton.addEventListener('click', () => {
        if (currentStep > 1) {
            updateStep(currentStep - 1);
        }
    });

    // NOVA PARTE: Configurar os botões "Adicionar à Sacola" em todos os cards de produto
    setupAddToCartButtons();
    
    // Inicializar o carrinho
    function initCart() {
        // Atualizar o contador de itens
        updateCartCount();
        
        // Renderizar os itens do carrinho na interface
        renderCartItems();
        
        // Calcular e atualizar os totais
        updateCartTotals();
    }
});

// NOVA FUNÇÃO: Configurar botões "Adicionar à Sacola" nos cards
function setupAddToCartButtons() {
    // Selecionar todos os botões "Adicionar à Sacola" nos cards
    document.querySelectorAll('.add-to-cart').forEach(button => {
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
    });
}

// Função para adicionar produto ao carrinho (pode ser chamada de qualquer lugar)
function addToCart(productId, quantity = 1) {
    // Encontrar o produto pelo ID
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error(`Produto com ID ${productId} não encontrado`);
        return;
    }
    
    // Verificar se o produto já está no carrinho
    const existingItemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (existingItemIndex > -1) {
        // Produto já existe, atualizar quantidade
        cartItems[existingItemIndex].quantity += quantity;
    } else {
        // Produto novo, adicionar ao carrinho
        cartItems.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.images[0], // Primeira imagem como principal
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
    cartItems = cartItems.filter(item => item.id !== productId);
    
    saveCartToLocalStorage();
    updateCartCount();
    renderCartItems();
    updateCartTotals();
}

// Função para atualizar a quantidade de um produto no carrinho
function updateCartItemQuantity(productId, newQuantity) {
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        if (newQuantity <= 0) {
            // Se a quantidade for zero ou negativa, remover o item
            removeFromCart(productId);
        } else {
            // Atualizar a quantidade
            cartItems[itemIndex].quantity = newQuantity;
            saveCartToLocalStorage();
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
    
    if (cartItems.length === 0) {
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
    cartItems.forEach(item => {
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
    
    // Atualizar também o resumo do pedido (passo 3)
    renderOrderSummary();
}

// Renderiza o resumo do pedido (passo 3)
function renderOrderSummary() {
    const summaryItemsContainer = document.querySelector('.summary-items');
    if (!summaryItemsContainer) return;
    
    summaryItemsContainer.innerHTML = '';
    
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-carrinho-content';
        itemElement.innerHTML = `
            <div class="item-details-group">
                <div class="item-image-resumo">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3 class="title-produto-resumo">${item.name}</h3>
                    <p class="price">${formatPrice(item.price)}</p>
                </div>
            </div>
            <p class="qtd-produto-resumo">x <b>${item.quantity}</b></p>
        `;
        summaryItemsContainer.appendChild(itemElement);
    });
    
    // Atualizar o endereço de entrega (se disponível)
    updateDeliveryAddress();
}

// Atualizar o endereço de entrega no resumo
function updateDeliveryAddress() {
    const addressElement = document.querySelector('.delivery-address');
    const addressContainer = document.querySelector('.resumo-entrega');
    
    if (!addressElement || !addressContainer) return;
    
    const cep = document.getElementById('txtCEP')?.value || '';
    const street = document.getElementById('address')?.value || '';
    const number = document.getElementById('txtNumero')?.value || '';
    const neighborhood = document.getElementById('txtBairro')?.value || '';
    const city = document.getElementById('txtCidade')?.value || '';
    const state = document.getElementById('ddlUF')?.value || '';
    
    if (street && city) {
        addressContainer.innerHTML = `
            <h3 class="title-produto-resumo">${street}, ${number}, ${neighborhood}</h3>
            <p>${city} - ${state} ${cep ? `/ ${cep}` : ''}</p>
        `;
    }
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

// Atualizar contador de itens
function updateCartCount() {
    const countElement = document.querySelector('.cart-count');
    if (!countElement) return;
    
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    countElement.textContent = totalItems;
    
    if (totalItems <= 0) {
        countElement.classList.add('empty');
    } else {
        countElement.classList.remove('empty');
    }
}

// Calcular e atualizar os totais do carrinho
function updateCartTotals() {
    const subtotalElement = document.getElementById('lblSubTotal');
    const deliveryElement = document.getElementById('lblValorEntrega');
    const totalElement = document.getElementById('lblValorTotal');
    
    if (!subtotalElement || !totalElement) return;
    
    // Calcular subtotal
    const subtotal = cartItems.reduce((total, item) => {
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
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Função para enviar o pedido para o WhatsApp
function sendOrderToWhatsApp() {
    if (cartItems.length === 0) return;
    
    // Obter os dados do cliente
    const name = document.getElementById('txtNomeCliente')?.value || '';
    const phone = document.getElementById('txtContatoCliente')?.value || '';
    const address = document.getElementById('address')?.value || '';
    const number = document.getElementById('txtNumero')?.value || '';
    const complement = document.getElementById('txtComplemento')?.value || '';
    const neighborhood = document.getElementById('txtBairro')?.value || '';
    const city = document.getElementById('txtCidade')?.value || '';
    const state = document.getElementById('ddlUF')?.value || '';
    const cep = document.getElementById('txtCEP')?.value || '';
    
    // Verificar dados obrigatórios
    if (!name || !phone || !address || !number || !neighborhood || !city || !state) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Montar a mensagem
    let message = `*Novo Pedido - Divina Fatia*\n\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Telefone:* ${phone}\n\n`;
    
    message += `*Endereço de Entrega:*\n`;
    message += `${address}, ${number}`;
    if (complement) message += `, ${complement}`;
    message += `\n${neighborhood}, ${city} - ${state}`;
    if (cep) message += `\nCEP: ${cep}`;
    
    message += `\n\n*Itens do Pedido:*\n`;
    
    let subtotal = 0;
    
    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        message += `${index + 1}. ${item.name} x${item.quantity} = ${formatPrice(itemTotal)}\n`;
    });
    
    // Calcular entrega
    const deliveryValue = subtotal >= 79 ? 0 : 12;
    const total = subtotal + deliveryValue;
    
    message += `\n*Subtotal:* ${formatPrice(subtotal)}`;
    message += `\n*Entrega:* ${deliveryValue === 0 ? 'GRÁTIS' : formatPrice(deliveryValue)}`;
    message += `\n*Total:* ${formatPrice(total)}`;
    
    // Preparar URL para WhatsApp
    const phoneNumber = "5511962073812"; // Número da confeiteira (formato: DDDnúmero)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp em nova janela
    window.open(whatsappUrl, '_blank');
    
    // Limpar o carrinho após enviar o pedido
    clearCart();
    
    // Fechar o modal
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.remove('active');
}

// Limpar o carrinho
function clearCart() {
    cartItems = [];
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
            <p><strong>${productName}</strong> adicionado à sacola!</p>
        </div>
    `;
    
    // Mostrar notificação
    notification.classList.add('active');
    
    // Esconder após 3 segundos
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// Função para formatar preço (importada de products-config.js)
// Caso a função já exista, você pode remover esta versão
function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Inicializar o sistema de busca de CEP 
function initCepSearch() {
    const cepInput = document.getElementById('txtCEP');
    const cepButton = document.querySelector('.search-cep');
    
    if (!cepInput || !cepButton) return;
    
    cepButton.addEventListener('click', () => {
        const cep = cepInput.value.replace(/\D/g, '');
        
        if (cep.length !== 8) {
            alert('CEP inválido. Digite os 8 números do CEP.');
            return;
        }
        
        // Fazer consulta à API do ViaCEP
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    alert('CEP não encontrado.');
                    return;
                }
                
                // Preencher os campos de endereço
                document.getElementById('address').value = data.logradouro;
                document.getElementById('txtBairro').value = data.bairro;
                document.getElementById('txtCidade').value = data.localidade;
                document.getElementById('ddlUF').value = data.uf;
                
                // Focar no campo de número
                document.getElementById('txtNumero').focus();
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
                alert('Erro ao buscar CEP. Tente novamente mais tarde.');
            });
    });
    
    // Também buscar ao pressionar Enter
    cepInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            cepButton.click();
        }
    });
}

// Inicializar o CEP quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initCepSearch);

// Inicializar os controles de quantidade em todos os cards de produtos
document.addEventListener('DOMContentLoaded', () => {
    // Controles de quantidade nos cards de produtos
    document.querySelectorAll('.quantity').forEach(container => {
        setupQuantityControls(container);
    });
});

// Configurar controles de quantidade
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

// Expor funções globalmente para uso em outros scripts
window.addToCart = addToCart;
window.setupQuantityControls = setupQuantityControls;
window.setupAddToCartButtons = setupAddToCartButtons;