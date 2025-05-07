// cart-modal.js - Gerenciamento completo do modal de carrinho
// Versão corrigida - 2025

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicialização do modal do carrinho
    initCartModal();
    
    // Inicialização da busca de CEP
    initCepSearch();
    
    // Adicionar os estilos CSS para mensagens
    addStyles();
});

// Inicialização do modal do carrinho
function initCartModal() {
    const cartModal = document.getElementById('cartModal');
    const cartButton = document.querySelector('.cart-button');
    const closeButton = cartModal?.querySelector('.close-modal-cart');
    const overlay = cartModal?.querySelector('.modal-overlay');
    const nextButton = cartModal?.querySelector('.btn-next');
    const backButton = cartModal?.querySelector('.btn-back');

    // Se não encontrar os elementos necessários, não continuar
    if (!cartModal) return;

    let currentStep = 1;

    // Abrir modal do carrinho
    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.classList.add('active');
            toggleBodyScrolling(true);
            updateStep(1);
        });
    }

    // Verificar se existe o botão flutuante para mobile e adicionar evento
    const stickyCartButton = document.querySelector('.cart-button-sticky');
    if (stickyCartButton) {
        stickyCartButton.addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.classList.add('active');
            toggleBodyScrolling(true);
            updateStep(1);
        });
    }

    // Fechar modal
    function closeModal() {
        cartModal.classList.remove('active');
        toggleBodyScrolling(false);
    }

    if (closeButton) closeButton.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Função para controlar o comportamento de rolagem do body
    function toggleBodyScrolling(isModalOpen) {
        if (isModalOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }

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
        
        // Se estiver indo para o passo 3, atualizar o resumo do pedido
        if (step === 3) {
            // Renderizar o resumo do pedido
            renderOrderSummary();
        }

        currentStep = step;
    }

    // Navegação entre passos
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentStep < 3) {
                // Se estiver no passo 2 indo para o 3, validar formulário de endereço
                if (currentStep === 2) {
                    if (!validateAddressForm()) {
                        return; // Impedir avanço se o formulário for inválido
                    }
                }
                
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

    // Ao inicializar, verificar se há itens no carrinho
    if (window.cartItems && window.cartItems.length > 0) {
        // Renderizar os itens do carrinho na interface
        renderCartItems();
    }
    
    // Tornar a função updateStep acessível globalmente
    window.updateStep = updateStep;
}

// Função para validar os dados do endereço antes de ir para o passo 3
function validateAddressForm() {
    // Obter os campos obrigatórios
    const requiredFields = [
        { id: 'txtNomeCliente', label: 'Nome' },
        { id: 'txtContatoCliente', label: 'Telefone' },
        { id: 'txtCEP', label: 'CEP' },
        { id: 'address', label: 'Endereço' },
        { id: 'txtNumero', label: 'Número' },
        { id: 'txtBairro', label: 'Bairro' },
        { id: 'txtCidade', label: 'Cidade' },
        { id: 'ddlUF', label: 'Estado' }
    ];
    
    let isValid = true;
    let firstInvalidField = null;
    let errorMessage = 'Por favor, preencha os seguintes campos:';
    
    // Verificar se cada campo está preenchido
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element) return;
        
        const value = element.value.trim();
        if (!value || (element.tagName === 'SELECT' && value === '-1')) {
            isValid = false;
            
            if (!firstInvalidField) {
                firstInvalidField = element;
            }
            
            // Adicionar a label do campo à mensagem de erro
            errorMessage += ` ${field.label},`;
            
            // Adicionar classe de erro ao campo
            element.classList.add('invalid-field');
        } else {
            // Remover classe de erro
            element.classList.remove('invalid-field');
        }
    });
    
    // Remover a vírgula extra no final da mensagem
    if (errorMessage.endsWith(',')) {
        errorMessage = errorMessage.slice(0, -1);
    }
    
    // Se o formulário não for válido, mostrar mensagem de erro
    if (!isValid) {
        mostrarMensagemValidacao(errorMessage);
        
        // Focar no primeiro campo inválido
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
    }
    
    return isValid;
}

// Função para mostrar mensagem de validação
function mostrarMensagemValidacao(texto) {
    // Verificar se já existe uma mensagem
    let mensagem = document.querySelector('.mensagem-validacao');
    
    // Se não existir, criar uma nova
    if (!mensagem) {
        mensagem = document.createElement('div');
        mensagem.className = 'mensagem-validacao';
        
        // Adicionar ao container
        const modalFooter = document.querySelector('.modal-footer');
        if (modalFooter) {
            modalFooter.parentNode.insertBefore(mensagem, modalFooter);
        }
    }
    
    // Atualizar o texto da mensagem
    mensagem.textContent = texto;
    
    // Remover após alguns segundos
    setTimeout(() => {
        if (mensagem && mensagem.parentNode) {
            mensagem.parentNode.removeChild(mensagem);
        }
    }, 5000);
}

// ==================
// BUSCA DE CEP
// ==================

// Função para inicializar a busca de CEP
function initCepSearch() {
    const searchCepButton = document.querySelector('.search-cep');
    const cepInput = document.getElementById('txtCEP');
    
    if (searchCepButton && cepInput) {
        // Adicionar evento ao botão de busca de CEP
        searchCepButton.addEventListener('click', (e) => {
            e.preventDefault();
            buscarCep();
        });
        
        // Permitir busca ao pressionar Enter no campo de CEP
        cepInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                buscarCep();
            }
        });
        
        // Máscara para o campo de CEP
        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            // Limitar a 9 caracteres (formato: 00000-000)
            if (value.length > 9) {
                value = value.substring(0, 9);
            }
            e.target.value = value;
        });
    }
}

// Função para buscar CEP via API ViaCEP
function buscarCep() {
    const cepInput = document.getElementById('txtCEP');
    if (!cepInput) return;
    
    // Limpar o CEP mantendo apenas números
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep === '') {
        mostrarMensagem('Informe o CEP, por favor.');
        cepInput.focus();
        return;
    }
    
    // Verificar se o CEP tem o formato válido (8 dígitos)
    const validacep = /^[0-9]{8}$/;
    
    if (!validacep.test(cep)) {
        mostrarMensagem('Formato do CEP inválido.');
        cepInput.focus();
        return;
    }
    
    // Mostrar indicador de carregamento
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = 'Buscando CEP...';
    
    const cepContainer = document.querySelector('.cep-container');
    if (cepContainer) {
        cepContainer.appendChild(loadingIndicator);
    }
    
    // Fazer a requisição para a API ViaCEP
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => {
            // Remover indicador de carregamento
            if (loadingIndicator.parentNode) {
                loadingIndicator.parentNode.removeChild(loadingIndicator);
            }
            
            if (!response.ok) {
                throw new Error('Erro na requisição do CEP');
            }
            return response.json();
        })
        .then(data => {
            if (data.erro) {
                mostrarMensagem('CEP não encontrado. Preencha as informações manualmente.');
                document.getElementById('address').focus();
                return;
            }
            
            // Preencher os campos com os dados retornados
            if (document.getElementById('address')) {
                document.getElementById('address').value = data.logradouro || '';
            }
            if (document.getElementById('txtBairro')) {
                document.getElementById('txtBairro').value = data.bairro || '';
            }
            if (document.getElementById('txtCidade')) {
                document.getElementById('txtCidade').value = data.localidade || '';
            }
            if (document.getElementById('ddlUF')) {
                document.getElementById('ddlUF').value = data.uf || '';
            }
            
            // Focar no campo de número após preencher o endereço
            if (document.getElementById('txtNumero')) {
                document.getElementById('txtNumero').focus();
            }
            
            // Atualizar o resumo do endereço
            updateDeliveryAddress();
        })
        .catch(error => {
            // Remover indicador de carregamento
            if (loadingIndicator.parentNode) {
                loadingIndicator.parentNode.removeChild(loadingIndicator);
            }
            
            console.error('Erro ao buscar CEP:', error);
            mostrarMensagem('Erro ao buscar CEP. Verifique sua conexão ou tente novamente mais tarde.');
        });
}

// Função auxiliar para exibir mensagens
function mostrarMensagem(texto) {
    // Verificar se já existe uma mensagem
    let mensagem = document.querySelector('.mensagem-cep');
    
    // Se não existir, criar uma nova
    if (!mensagem) {
        mensagem = document.createElement('div');
        mensagem.className = 'mensagem-cep';
        
        // Adicionar ao container
        const cepContainer = document.querySelector('.cep-container');
        if (cepContainer) {
            cepContainer.appendChild(mensagem);
        } else {
            // Se não encontrar o container, adicionar após o campo de CEP
            const cepInput = document.getElementById('txtCEP');
            if (cepInput && cepInput.parentNode) {
                cepInput.parentNode.appendChild(mensagem);
            }
        }
    }
    
    // Atualizar o texto da mensagem
    mensagem.textContent = texto;
    
    // Remover após alguns segundos
    setTimeout(() => {
        if (mensagem && mensagem.parentNode) {
            mensagem.parentNode.removeChild(mensagem);
        }
    }, 5000);
}

// ==================
// RESUMO DO PEDIDO
// ==================

// Renderiza o resumo do pedido (itens e endereço)
function renderOrderSummary() {
    console.log("Renderizando resumo do pedido");
    // Renderizar itens do carrinho
    renderOrderItems();
    
    // Atualizar o endereço de entrega
    updateDeliveryAddress();
    
    // Atualizar os totais do carrinho
    updateCartTotals();
}

// Renderiza os itens do pedido na etapa 3
function renderOrderItems() {
    const summaryItemsContainer = document.querySelector('.summary-items');
    if (!summaryItemsContainer) {
        console.error("Container .summary-items não encontrado");
        return;
    }
    
    // Limpar o conteúdo existente
    summaryItemsContainer.innerHTML = '';
    
    // Verificar se há acesso aos itens do carrinho global
    // Garantir que estamos acessando a array global
    if (!window.cartItems || !Array.isArray(window.cartItems)) {
        console.error("Array de itens do carrinho não encontrado ou inválido");
        summaryItemsContainer.innerHTML = `
            <div class="item-carrinho-content">
                <p>Erro ao acessar os itens da sacola.</p>
            </div>
        `;
        return;
    }
    
    // Obter os itens do carrinho da variável global
    const cartItems = window.cartItems;
    
    if (cartItems.length === 0) {
        summaryItemsContainer.innerHTML = `
            <div class="item-carrinho-content">
                <p>Nenhum item adicionado à sacola.</p>
            </div>
        `;
        return;
    }
    
    // Adicionar cada item ao resumo
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-carrinho-content';
        
        // Usar a função global formatPrice se disponível, ou fazer formatação local
        const formattedPrice = typeof window.formatPrice === 'function' 
            ? window.formatPrice(item.price)
            : `R$ ${item.price.toFixed(2).replace('.', ',')}`;
            
        itemElement.innerHTML = `
            <div class="item-details-group">
                <div class="item-image-resumo">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3 class="title-produto-resumo">${item.name}</h3>
                    <p class="price">${formattedPrice}</p>
                </div>
            </div>
            <p class="qtd-produto-resumo">x <b>${item.quantity}</b></p>
        `;
        
        summaryItemsContainer.appendChild(itemElement);
    });
}

// Atualiza o endereço de entrega no resumo
function updateDeliveryAddress() {
    const addressContainer = document.querySelector('.resumo-entrega');
    if (!addressContainer) {
        console.error("Container .resumo-entrega não encontrado");
        return;
    }
    
    // Obter valores dos campos
    const cep = document.getElementById('txtCEP')?.value || '';
    const street = document.getElementById('address')?.value || '';
    const number = document.getElementById('txtNumero')?.value || '';
    const complement = document.getElementById('txtComplemento')?.value || '';
    const neighborhood = document.getElementById('txtBairro')?.value || '';
    const city = document.getElementById('txtCidade')?.value || '';
    const state = document.getElementById('ddlUF')?.value || '';
    
    // Formatar o endereço para exibição
    if (street) {
        // Linha 1: Rua, número e complemento
        let addressLine1 = street;
        if (number) addressLine1 += `, ${number}`;
        if (complement) addressLine1 += `, ${complement}`;
        
        // Linha 2: Bairro, cidade, estado e CEP
        let addressLine2 = [];
        if (neighborhood) addressLine2.push(neighborhood);
        
        let cityStateText = '';
        if (city) cityStateText += city;
        if (state) cityStateText += city ? ` - ${state}` : state;
        if (cityStateText) addressLine2.push(cityStateText);
        
        if (cep) addressLine2.push(cep);
        
        // Atualizar o HTML
        addressContainer.innerHTML = `
            <h3 class="title-produto-resumo">${addressLine1}</h3>
            <p>${addressLine2.join(' / ')}</p>
        `;
    } else {
        // Se não tiver endereço, mostrar mensagem padrão
        addressContainer.innerHTML = `
            <h3 class="title-produto-resumo">Endereço não informado</h3>
            <p>Por favor, volte à etapa anterior e informe seu endereço.</p>
        `;
    }
}

// Calcular e atualizar os totais do carrinho
function updateCartTotals() {
    const subtotalElement = document.getElementById('lblSubTotal');
    const deliveryElement = document.getElementById('lblValorEntrega');
    const totalElement = document.getElementById('lblValorTotal');

    if (!subtotalElement || !totalElement) return;

    // Usar a variável global do carrinho
    if (!window.cartItems) {
        console.error("Array de itens do carrinho não encontrado");
        return;
    }

    // Calcular subtotal
    const subtotal = window.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    // Definir o valor da entrega (pode ser dinâmico com base no CEP)
    const deliveryValue = subtotal >= 79 ? 0 : 12;

    // Calcular total
    const total = subtotal + deliveryValue;

    // Função auxiliar para formatar preço
    function formatLocalPrice(price) {
        if (typeof window.formatPrice === 'function') {
            return window.formatPrice(price);
        }
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    // Atualizar os elementos na interface
    subtotalElement.textContent = formatLocalPrice(subtotal);

    if (deliveryElement) {
        if (deliveryValue === 0) {
            deliveryElement.textContent = 'GRÁTIS';
            deliveryElement.style.color = 'var(--color-addcart-01)';
        } else {
            deliveryElement.textContent = `+ ${formatLocalPrice(deliveryValue)}`;
            deliveryElement.style.color = '';
        }
    }

    totalElement.textContent = formatLocalPrice(total);

    // Habilitar/desabilitar botão de próximo passo com base no subtotal
    const nextButton = document.querySelector('.btn-next');
    if (nextButton) {
        nextButton.disabled = subtotal <= 0;
    }
}

// Função para enviar o pedido para o WhatsApp
function sendOrderToWhatsApp() {
    // Verificar se temos acesso aos itens do carrinho
    if (!window.cartItems || !Array.isArray(window.cartItems)) {
        alert('Erro ao acessar os itens do carrinho. Por favor, recarregue a página.');
        return;
    }
    
    if (window.cartItems.length === 0) {
        alert('Sua sacola está vazia. Adicione produtos antes de finalizar o pedido.');
        return;
    }

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

    // Formatar data e hora atual
    const now = new Date();
    const dataHora = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    // Montar a mensagem
    let message = `*NOVO PEDIDO - DIVINA FATIA*\n`;
    message += `_Pedido realizado em: ${dataHora}_\n\n`;
    
    message += `*📋 DADOS DO CLIENTE:*\n`;
    message += `▸ Nome: ${name}\n`;
    message += `▸ Telefone: ${phone}\n\n`;

    message += `*📍 ENDEREÇO DE ENTREGA:*\n`;
    message += `▸ ${address}, ${number}`;
    if (complement) message += `, ${complement}`;
    message += `\n▸ ${neighborhood}, ${city} - ${state}`;
    if (cep) message += `\n▸ CEP: ${cep}`;

    message += `\n\n*🎂 ITENS DO PEDIDO:*\n`;

    let subtotal = 0;

    window.cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        message += `${index + 1}. *${item.name}*\n`;
        message += `   ${item.quantity}x ${formatLocalPrice(item.price)} = ${formatLocalPrice(itemTotal)}\n`;
    });

    // Calcular entrega
    const deliveryValue = subtotal >= 79 ? 0 : 12;
    const total = subtotal + deliveryValue;

    message += `\n*💰 RESUMO DO PEDIDO:*\n`;
    message += `▸ Subtotal: ${formatLocalPrice(subtotal)}\n`;
    message += `▸ Entrega: ${deliveryValue === 0 ? 'GRÁTIS 🎁' : formatLocalPrice(deliveryValue)}\n`;
    message += `▸ *TOTAL: ${formatLocalPrice(total)}*\n\n`;
    
    message += `🙏 Obrigado por escolher a Divina Fatia!`;

    // Função formatPrice local se não estiver disponível globalmente
    function formatLocalPrice(price) {
        if (typeof window.formatPrice === 'function') {
            return window.formatPrice(price);
        }
        return price.toLocaleString('pt-BR', {
            style: 'currency', 
            currency: 'BRL'
        });
    }

    // Preparar URL para WhatsApp
    const phoneNumber = "5511962073812"; // Número da confeiteira (formato: DDDnúmero)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Abrir WhatsApp em nova janela
    window.open(whatsappUrl, '_blank');

    // Limpar o carrinho após enviar o pedido
    if (typeof window.clearCart === 'function') {
        window.clearCart();
    } else {
        // Se a função global não estiver disponível, limpar localmente
        window.cartItems = [];
        localStorage.setItem('cartItems', JSON.stringify([]));
        
        // Atualizar a interface se possível
        if (typeof window.updateCartCount === 'function') {
            window.updateCartCount();
        }
    }

    // Fechar o modal
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
    
    // Mostrar mensagem de sucesso
    showSuccessMessage('Pedido enviado com sucesso! Em breve entraremos em contato.');
}

// Função para mostrar mensagem de sucesso após finalizar pedido
function showSuccessMessage(message) {
    // Se existir uma função global, usar ela
    if (typeof window.showSuccessMessage === 'function') {
        window.showSuccessMessage(message);
        return;
    }
    
    // Caso contrário, implementar localmente
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    
    // Estilizar o elemento
    Object.assign(successMessage.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'var(--color-primary-03)',
        border: '1px solid var(--color-addcart-01)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-lg)',
        zIndex: '9999',
        textAlign: 'center',
        maxWidth: '80%'
    });
    
    // Adicionar conteúdo
    successMessage.innerHTML = `
        <div style="margin-bottom: 15px; color: var(--color-addcart-01);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        </div>
        <h3 style="margin-bottom: 10px; color: var(--color-addcart-01);">Pedido Enviado!</h3>
        <p>${message}</p>
        <button class="close-success" style="
            margin-top: 15px;
            background: var(--color-addcart-01);
            color: white;
            border: none;
            border-radius: var(--radius-md);
            padding: 8px 16px;
            cursor: pointer;
            font-weight: var(--font-weight-semibold);">
            Fechar
        </button>
    `;
    
    // Adicionar ao corpo do documento
    document.body.appendChild(successMessage);
    
    // Adicionar evento ao botão de fechar
    const closeButton = successMessage.querySelector('.close-success');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            document.body.removeChild(successMessage);
        });
    }
    
    // Remover automaticamente após 8 segundos
    setTimeout(() => {
        if (document.body.contains(successMessage)) {
            document.body.removeChild(successMessage);
        }
    }, 8000);
}

// Adicionar estilos para elementos visuais
function addStyles() {
    // Verificar se já existe
    if (document.getElementById('cart-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'cart-modal-styles';
    style.textContent = `
        .invalid-field {
            border-color: var(--color-terciary-06) !important;
            background-color: rgba(255, 107, 107, 0.05) !important;
        }
        
        .mensagem-validacao,
        .mensagem-cep {
            color: var(--color-terciary-06);
            font-size: var(--text-sm);
            padding: 10px;
            margin: 10px 0;
            border-radius: var(--radius-md);
            background-color: rgba(255, 107, 107, 0.1);
            border-left: 3px solid var(--color-terciary-06);
        }
        
        .loading-indicator {
            font-size: var(--text-sm);
            color: var(--color-primary-01);
            margin-top: 8px;
            padding-left: 20px;
            position: relative;
            animation: pulse 1.5s infinite;
        }
        
        .loading-indicator::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            border: 2px solid var(--color-primary-01);
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: translateY(-50%) rotate(360deg); }
        }
        
        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }
    `;
    
    document.head.appendChild(style);
}

// Função utilitária para limitar chamadas repetidas (debounce)
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Expor funções importantes para serem acessadas globalmente
window.renderOrderSummary = renderOrderSummary;
window.updateDeliveryAddress = updateDeliveryAddress;
window.buscarCep = buscarCep;
window.updateCartTotals = updateCartTotals;

// Função para renderizar os itens do carrinho
// Esta é uma versão adaptada da função renderCartItems específica para uso quando
// precisamos atualizar a interface do carrinho fora deste arquivo
window.renderCartItems = function() {
    const cartItemsContainer = document.getElementById('itensCarrinho');
    if (!cartItemsContainer) return;

    // Limpar conteúdo existente
    cartItemsContainer.innerHTML = '';

    // Verificar se há itens no carrinho
    if (!window.cartItems || window.cartItems.length === 0) {
        // Carrinho vazio
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Sua sacola está vazia</p>
                <p class="empty-cart-message">Adicione produtos deliciosos para continuar</p>
            </div>
        `;
        return;
    }

    // Adicionar cada item do carrinho
    window.cartItems.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        
        // Formatar preço
        const formattedPrice = typeof window.formatPrice === 'function' 
            ? window.formatPrice(item.price)
            : `R$ ${item.price.toFixed(2).replace('.', ',')}`;
            
        cartItemElement.innerHTML = `
            <div class="items-details">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="price">${formattedPrice}</p>
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

    // Adicionar evento aos itens do carrinho
    attachCartItemEvents();
};

// Função para adicionar eventos aos itens do carrinho
function attachCartItemEvents() {
    // Botões de quantidade (menos)
    document.querySelectorAll('.cart-item .qty-btn.minus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.product);
            const quantityElement = button.nextElementSibling;
            let quantity = parseInt(quantityElement.textContent);
            
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
                
                // Atualizar a quantidade do item no carrinho
                if (typeof window.updateCartItemQuantity === 'function') {
                    window.updateCartItemQuantity(productId, quantity);
                }
            }
        });
    });

    // Botões de quantidade (mais)
    document.querySelectorAll('.cart-item .qty-btn.plus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.product);
            const quantityElement = button.previousElementSibling;
            let quantity = parseInt(quantityElement.textContent);
            
            quantity++;
            quantityElement.textContent = quantity;
            
            // Atualizar a quantidade do item no carrinho
            if (typeof window.updateCartItemQuantity === 'function') {
                window.updateCartItemQuantity(productId, quantity);
            }
        });
    });

    // Botões de remover item
    document.querySelectorAll('.btn-retirar').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.product);
            
            // Remover o item do carrinho
            if (typeof window.removeFromCart === 'function') {
                window.removeFromCart(productId);
            }
        });
    });
}

// Ao finalizar a carga do script, verificar se o carrinho já está inicializado
if (!window.cartItems) {
    // Se não estiver definido, inicializar a partir do localStorage
    window.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
}