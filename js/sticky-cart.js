// Versão corrigida do sticky-cart.js

document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o botão flutuante do carrinho
    const stickyCart = document.querySelector('.cart-sticky-mobile');
    // Seleciona o contador de itens do carrinho
    const cartCountSticky = document.querySelector('.cart-count-sticky');
    
    // Função para atualizar o contador do carrinho flutuante
    function updateStickyCartCount() {
        // Seleciona o contador de itens do carrinho original
        const originalCartCount = document.querySelector('.cart-count');
        
        if (originalCartCount && cartCountSticky) {
            // Copia o valor do contador original para o flutuante
            cartCountSticky.textContent = originalCartCount.textContent;
            
            // Adiciona ou remove a classe 'empty' com base no valor
            if (originalCartCount.textContent === '0' || originalCartCount.classList.contains('empty')) {
                cartCountSticky.classList.add('empty');
            } else {
                cartCountSticky.classList.remove('empty');
            }
        }
    }
    
    // Função para mostrar/esconder o botão do carrinho flutuante baseado na rolagem
    function toggleStickyCart() {
        // Mudamos para que o carrinho apareça logo após começar a rolagem
        // Valor mais baixo faz com que apareça mais cedo
        const scrollThreshold = 600; // Ajuste este valor para controlar quando o carrinho aparece
        
        if (window.scrollY > scrollThreshold) {
            // Mostrar o botão flutuante quando rolar além do limite
            stickyCart.classList.add('visible');
        } else {
            // Esconder o botão flutuante quando estiver próximo ao topo
            stickyCart.classList.remove('visible');
        }
    }
    
    // Associar o botão flutuante ao mesmo modal do botão original
    if (stickyCart) {
        const cartButton = stickyCart.querySelector('.cart-button-sticky');
        
        if (cartButton) {
            cartButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Seleciona o modal do carrinho
                const cartModal = document.getElementById('cartModal');
                
                if (cartModal) {
                    // Adiciona a classe 'active' para mostrar o modal
                    cartModal.classList.add('active');
                    document.body.classList.add('modal-open');
                    
                    // Se houver uma função existente para atualizar o passo do carrinho, chame-a
                    if (typeof updateStep === 'function') {
                        updateStep(1);
                    }
                }
            });
        }
    }
    
    // Corrigindo o bug do modal: garantir que ao fechar o modal o scroll volte a funcionar
    const closeButtons = document.querySelectorAll('.close-modal-cart, .modal-overlay');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover a classe modal-open do body para reativar o scroll
            document.body.classList.remove('modal-open');
        });
    });
    
    // Adicionar a função ao evento de rolagem da página
    window.addEventListener('scroll', toggleStickyCart);
    
    // Observar mudanças no contador original do carrinho
    const originalCartCount = document.querySelector('.cart-count');
    if (originalCartCount) {
        // Configurar um MutationObserver para detectar mudanças no contador original
        const observer = new MutationObserver(function(mutations) {
            updateStickyCartCount();
            
            // Adicionar efeito de pulsar quando o valor mudar (aumentar)
            if (stickyCart.classList.contains('visible')) {
                stickyCart.classList.add('pulse');
                setTimeout(() => {
                    stickyCart.classList.remove('pulse');
                }, 500);
            }
        });
        
        // Observar mudanças no conteúdo e classes
        observer.observe(originalCartCount, { 
            characterData: true, 
            childList: true,
            attributes: true,
            subtree: true 
        });
    }
    
    // Inicializar o contador e verificar posição inicial
    updateStickyCartCount();
    toggleStickyCart();
    
    // Adicionar evento quando adicionar produtos ao carrinho
    document.addEventListener('addToCart', function() {
        updateStickyCartCount();
    });
});