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

// Função para formatar preço em BRL
function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Controle de quantidade
function setupQuantityControls(container) {
    const minusBtn = container.querySelector('.minus');
    const plusBtn = container.querySelector('.plus');
    const displayElement = container.querySelector('.qty-display');

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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Configurar controles de quantidade em todos os cards
    document.querySelectorAll('.quantity').forEach(container => {
        setupQuantityControls(container);
    });

    // Configurar botões de adicionar à sacola - esta função será substituída pela do cart.js
    if (typeof window.setupAddToCartButtons === 'function') {
        window.setupAddToCartButtons();
    }

    // Adicionar evento de clique nas imagens dos produtos para abrir o modal
    document.querySelectorAll('.card-image img').forEach(img => {
        const productCard = img.closest('.product-card');
        const productId = parseInt(productCard.querySelector('.add-to-cart').dataset.product);
        
        img.addEventListener('click', () => {
            // A função showProductModal será definida em product-modal.js
            showProductModal(productId);
        });
    });
});

// Exportar funções e dados necessários
window.products = products;
window.formatPrice = formatPrice;
window.setupQuantityControls = setupQuantityControls;