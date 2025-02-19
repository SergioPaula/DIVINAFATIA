// Dados dos produtos
const products = [
    {
        id: 1,
        name: "Bolo de Chocolate com Brigadeiro",
        price: 79.90,
        oldPrice: 89.90
    },
    {
        id: 2,
        name: "Red Velvet",
        price: 89.90
    },
    {
        id: 3,
        name: "Bolo de Cenoura",
        price: 59.90,
        oldPrice: 69.90
    }
];

// Função para formatar preço em BRL
function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Controle de quantidade
document.querySelectorAll('.qty-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const productId = e.target.dataset.product;
        const isPlus = e.target.classList.contains('plus');
        const displayElement = e.target.parentElement.querySelector('.qty-display');
        let quantity = parseInt(displayElement.textContent);

        if (isPlus) {
            quantity++;
        } else if (quantity > 1) {
            quantity--;
        }

        displayElement.textContent = quantity;
        updateButtonState(e.target.parentElement, quantity);
    });
});

// Atualiza estado dos botões de quantidade
function updateButtonState(container, quantity) {
    const minusButton = container.querySelector('.minus');
    minusButton.disabled = quantity <= 1;
}

// Adicionar à sacola (integração com WhatsApp)
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.product);
        const product = products.find(p => p.id === productId);
        const quantityElement = e.target.parentElement.parentElement.querySelector('.qty-display');
        const quantity = parseInt(quantityElement.textContent);

        if (product) {
            const total = product.price * quantity;
            const message = `Olá! Gostaria de encomendar ${quantity}x ${product.name} por ${formatPrice(total)}`;
            const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    });
});

// Inicialização - desabilita botões minus inicialmente
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.quantity').forEach(container => {
        updateButtonState(container, 1);
    });
});