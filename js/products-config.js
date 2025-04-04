// products-config.js - Versão unificada com funcionalidades do carrinho

// Dados dos produtos
const products = [
    {
        id: 1,
        name: "Bolo de Chocolate com Brigadeiro",
        price: 79.90,
        oldPrice: 89.90,
        description: "Delicioso bolo de chocolate coberto com brigadeiro cremoso e chocolate belga ralado. Uma explosão de sabor para os amantes de chocolate.",
        detailedDescription: "Bolo super macio feito com chocolate premium, recheado e coberto com brigadeiro cremoso preparado no fogão da maneira tradicional. Finalizado com raspas de chocolate belga.",
        ingredients: "Farinha de trigo, açúcar, ovos, leite, chocolate em pó, manteiga, brigadeiro (leite condensado, manteiga, chocolate em pó)",
        allergens: {
            gluten: true,
            lactose: true,
            nuts: false
        },
        specifications: {
            weight: "1.5kg",
            serves: "15 a 20 fatias",
            size: "23cm de diâmetro",
            height: "12cm de altura",
            storage: "5 dias em geladeira",
            bestTime: "2 dias após a compra"
        },
        images: [
            "./img/PRODUTOS/01-chocolate/01.png"
        ],
        rating: 4.5,
        reviewCount: 28
    },
    {
        id: 2,
        name: "Red Velvet",
        price: 89.90,
        description: "Clássico bolo Red Velvet com cobertura de cream cheese",
        detailedDescription: "Bolo vermelho aveludado com suave sabor de cacau, recheado e coberto com creme de cream cheese. Uma combinação perfeita de texturas e sabores.",
        ingredients: "Farinha de trigo, açúcar, ovos, buttermilk, corante vermelho, cacau em pó, cream cheese, manteiga",
        allergens: {
            gluten: true,
            lactose: true,
            nuts: false
        },
        specifications: {
            weight: "1.6kg",
            serves: "15 a 20 fatias",
            size: "23cm de diâmetro",
            height: "12cm de altura",
            storage: "5 dias em geladeira",
            bestTime: "2 dias após a compra"
        },
        images: [
            "./img/PRODUTOS/01-chocolate/01.png" // Atualizar com a imagem correta
        ],
        rating: 4.8,
        reviewCount: 15
    },
    {
        id: 3,
        name: "Bolo de Cenoura",
        price: 59.90,
        oldPrice: 69.90,
        description: "Clássico bolo de cenoura com cobertura de chocolate",
        detailedDescription: "Bolo de cenoura super fofinho feito com cenouras frescas e cobertura de chocolate meio amargo. O equilíbrio perfeito entre o dulçor da cenoura e o sabor do chocolate.",
        ingredients: "Cenoura, farinha de trigo, açúcar, ovos, óleo, chocolate meio amargo, manteiga",
        allergens: {
            gluten: true,
            lactose: true,
            nuts: false
        },
        specifications: {
            weight: "1.4kg",
            serves: "15 a 20 fatias",
            size: "23cm de diâmetro",
            height: "12cm de altura",
            storage: "5 dias em geladeira",
            bestTime: "2 dias após a compra"
        },
        images: [
            "./img/PRODUTOS/01-chocolate/01.png" // Atualizar com a imagem correta
        ],
        rating: 4.7,
        reviewCount: 32
    }
];

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

// Estado global do carrinho
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Função para adicionar produto ao carrinho
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
            updateCartCount();
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
    minusBtn.replaceWith(minusBtn.cloneNode(true));
    plusBtn.replaceWith(plusBtn.cloneNode(true));

    // Obter novamente as referências após o clone
    const newMinusBtn = container.querySelector('.minus');
    const newPlusBtn = container.querySelector('.plus');

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
// INICIALIZAÇÃO E MODAL DE PRODUTO
// ==================

// Mostrar o modal de produto
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

// ==================
// INICIALIZAÇÃO
// ==================

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar o carrinho
    initCart();

    // Configurar controles de quantidade em todos os cards
    document.querySelectorAll('.quantity').forEach(container => {
        setupQuantityControls(container);
    });

    // Configurar botões de adicionar à sacola
    setupAddToCartButtons();

    // Inicializar o modal
    initModal();

    // Inicializar a busca de CEP
    initCepSearch();
});

// Inicializar o carrinho
function initCart() {
    // Elementos do carrinho
    const cartModal = document.getElementById('cartModal');
    const cartButton = document.querySelector('.cart-button');
    const closeButton = cartModal?.querySelector('.close-modal-cart');
    const overlay = cartModal?.querySelector('.modal-overlay');
    const nextButton = cartModal?.querySelector('.btn-next');
    const backButton = cartModal?.querySelector('.btn-back');
    const cartCountElement = document.querySelector('.cart-count');

    // Se não tiver elementos do carrinho, não continuar
    if (!cartModal) return;

    let currentStep = 1;

    // Atualizar o contador de itens
    updateCartCount();

    // Renderizar os itens do carrinho na interface
    renderCartItems();

    // Calcular e atualizar os totais
    updateCartTotals();

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

    if (closeButton) closeButton.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

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
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentStep < 3) {
                updateStep(currentStep + 1);
            } else {
                // Lógica para finalizar o pedido
                sendOrderToWhatsApp();
            }
        });
    }

    if (backButton) {
        backButton.addEventListener('click', () => {
            if (currentStep > 1) {
                updateStep(currentStep - 1);
            }
        });
    }
}

// Inicializar o modal de produto
function initModal() {
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

    // Escutar cliques nas imagens dos produtos
    document.querySelectorAll('.product-card .card-image').forEach(imageContainer => {
        imageContainer.addEventListener('click', () => {
            const productCard = imageContainer.closest('.product-card');
            if (productCard) {
                const addToCartBtn = productCard.querySelector('.add-to-cart');
                if (addToCartBtn) {
                    const productId = parseInt(addToCartBtn.dataset.product);
                    showProductModal(productId);
                }
            }
        });
    });

    // Configurar navegação por abas no modal
    setupModalTabs();
}

// Exportar funções para uso global
window.products = products;
window.formatPrice = formatPrice;
window.setupQuantityControls = setupQuantityControls;
window.showProductModal = showProductModal;
window.closeProductModal = closeProductModal;
window.setupAddToCartButtons = setupAddToCartButtons;
window.addToCart = addToCart;