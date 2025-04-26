// Ajustes para experiência em tablets
document.addEventListener('DOMContentLoaded', function() {
    // Detectar se estamos em um tablet
    const isTablet = window.innerWidth >= 769 && window.innerWidth <= 1024;
    
    // Ajustes específicos para tablets
    if (isTablet) {
        // 1. Melhorar experiência de toque nos cards de produto
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            // Aumentar área de toque para controles de quantidade
            const qtyButtons = card.querySelectorAll('.qty-btn');
            qtyButtons.forEach(button => {
                button.style.width = '40px';
                button.style.height = '40px';
            });
        });

        // 2. Ajustar exibição do menu de filtro para melhor visualização
        const menuCardapio = document.querySelector('.menucardapio');
        if (menuCardapio) {
            // Adicionar indicador visual de scroll horizontal
            const scrollIndicator = document.createElement('div');
            scrollIndicator.className = 'scroll-indicator';
            scrollIndicator.innerHTML = '<span>&#8594;</span>';
            scrollIndicator.style.position = 'absolute';
            scrollIndicator.style.right = '10px';
            scrollIndicator.style.top = '50%';
            scrollIndicator.style.transform = 'translateY(-50%)';
            scrollIndicator.style.background = 'rgba(255, 255, 255, 0.7)';
            scrollIndicator.style.borderRadius = '50%';
            scrollIndicator.style.width = '30px';
            scrollIndicator.style.height = '30px';
            scrollIndicator.style.display = 'flex';
            scrollIndicator.style.alignItems = 'center';
            scrollIndicator.style.justifyContent = 'center';
            scrollIndicator.style.zIndex = '10';
            
            // Adicionar ao menu apenas se houver overflow
            if (menuCardapio.scrollWidth > menuCardapio.clientWidth) {
                menuCardapio.style.position = 'relative';
                menuCardapio.appendChild(scrollIndicator);
                
                // Ocultar indicador após algum tempo
                setTimeout(() => {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.transition = 'opacity 0.5s ease';
                }, 3000);
            }
        }

        // 3. Melhorias para o modal do carrinho
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            // Ajustar modal para ser mais amplo em tablets
            const modalContent = cartModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.maxWidth = '90%';
                modalContent.style.margin = '5vh auto';
            }
            
            // Melhorar interação com o teclado nos campos de formulário
            const inputs = cartModal.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    // Rolar para garantir que o campo esteja visível quando o teclado aparecer
                    setTimeout(() => {
                        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                });
            });
        }

        // 4. Ajustes para o modal de produto
        const productModal = document.querySelector('.modalproduct-overlay');
        if (productModal) {
            const modalContainer = productModal.querySelector('.product-modal');
            if (modalContainer) {
                // Melhorar scrolling no modal de produto
                modalContainer.addEventListener('touchmove', function(e) {
                    // Prevenir propagação do evento de toque para melhorar o scroll
                    e.stopPropagation();
                }, { passive: true });
                
                // Aumentar área de toque para os links do menu do modal
                const navLinks = modalContainer.querySelectorAll('.nav-itemmodal a');
                navLinks.forEach(link => {
                    link.style.padding = '8px 12px';
                });
            }
        }
    }
    
    // Garantir que o layout responda a mudanças de orientação
    window.addEventListener('resize', function() {
        const currentIsTablet = window.innerWidth >= 769 && window.innerWidth <= 1024;
        
        // Se mudar entre tablet e outro formato, recarregar para aplicar estilos corretos
        if (currentIsTablet !== isTablet) {
            // Atualizar apenas componentes específicos sem recarregar a página inteira
            // Isso evita perder o estado atual do carrinho
            
            // Atualizar Swiper
            if (typeof swiper !== 'undefined') {
                swiper.update();
            }
            
            // Recalcular layout do modal de produto se estiver aberto
            const openProductModal = document.querySelector('.modalproduct-overlay[style*="display: block"]');
            if (openProductModal) {
                const modalContainer = openProductModal.querySelector('.product-modal');
                if (modalContainer) {
                    // Forçar recálculo do layout
                    modalContainer.style.display = 'none';
                    setTimeout(() => {
                        modalContainer.style.display = '';
                    }, 0);
                }
            }
        }
    });
});