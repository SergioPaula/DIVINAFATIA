// Script para controlar o comportamento do menu móvel
document.addEventListener('DOMContentLoaded', () => {
    // Elementos do menu
    const menuButton = document.getElementById('burguer');
    const sideMenu = document.getElementById('mobile-side-menu');
    const overlay = document.getElementById('menu-overlay');
    const closeButton = document.getElementById('close-menu');
    
    // Abrir menu ao clicar no botão hambúrguer
    menuButton.addEventListener('click', () => {
        sideMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Impede o scroll da página
    });
    
    // Funções para fechar o menu
    function closeMenu() {
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restaura o scroll
    }
    
    // Fechar menu ao clicar no X
    if (closeButton) {
        closeButton.addEventListener('click', closeMenu);
    }
    
    // Fechar menu ao clicar no overlay
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }
    
    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
});