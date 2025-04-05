// Funções do carrinho
document.addEventListener('DOMContentLoaded', () => {
    const cartModal = document.getElementById('cartModal');
    const cartButton = document.querySelector('.nav-car');
    const closeButton = cartModal.querySelector('.close-modal-cart');
    const overlay = cartModal.querySelector('.modal-overlay');
    const nextButton = cartModal.querySelector('.btn-next');
    const backButton = cartModal.querySelector('.btn-back');

    let currentStep = 1;

    // Abrir modal do carrinho
    cartButton.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.classList.add('active');
        toggleBodyScrolling(true);
        updateStep(1);
    });

    // Fechar modal
    function closeModal() {
        cartModal.classList.remove('active');
        toggleBodyScrolling(false);
    }

    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);


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

        currentStep = step;
    }

    // Navegação entre passos
    nextButton.addEventListener('click', () => {
        if (currentStep < 3) {
            updateStep(currentStep + 1);
        } else {
            // Aqui vai a lógica para finalizar o pedido
            alert('Pedido finalizado!');
        }
    });

    backButton.addEventListener('click', () => {
        if (currentStep > 1) {
            updateStep(currentStep - 1);
        }
    });
});