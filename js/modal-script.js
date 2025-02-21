// No JavaScript, adicione este código:
document.querySelectorAll('.card-clickable').forEach(card => {
    card.addEventListener('click', (e) => {
        // Não abre o modal se clicar nos controles de quantidade ou botão de compra
        if (e.target.closest('.purchase-controls')) {
            return;
        }

        // Pega o ID do produto do data-attribute
        const productId = card.dataset.productId;
        
        // Pega os dados do produto
        const product = products.find(p => p.id === parseInt(productId));
        
        if (product) {
            // Preenche o modal com os dados do produto
            fillModalData(product);
            // Abre o modal
            openModal();
        }
    });
});

// Função para preencher os dados no modal
function fillModalData(product) {
    const modal = document.getElementById('productModal');
    
    // Preenche a imagem
    modal.querySelector('.modal-image img').src = product.image;
    modal.querySelector('.modal-image img').alt = product.name;
    
    // Preenche o título
    modal.querySelector('.modal-header h2').textContent = product.name;
    
    // Preenche as informações principais
    const mainInfo = modal.querySelector('.modal-main-info');
    mainInfo.querySelector('[data-info="servings"]').textContent = product.servings;
    mainInfo.querySelector('[data-info="weight"]').textContent = product.weight;
    mainInfo.querySelector('[data-info="validity"]').textContent = product.validity;
    
    // Preenche a descrição
    modal.querySelector('.modal-description p').textContent = product.description;
    
    // Preenche os ingredientes
    modal.querySelector('.modal-ingredients p').textContent = product.ingredients;
    
    // Preenche as informações de alergia
    modal.querySelector('.alert-box p').textContent = product.allergyInfo;
    
    // Preenche os preços
    if (product.oldPrice) {
        modal.querySelector('.old-price').textContent = formatPrice(product.oldPrice);
        modal.querySelector('.old-price').style.display = 'block';
    } else {
        modal.querySelector('.old-price').style.display = 'none';
    }
    modal.querySelector('.current-price').textContent = formatPrice(product.price);
    
    // Reseta a quantidade
    quantity = 1;
    modal.querySelector('.qty-number').textContent = quantity;
    updateTotal();
    
    // Atualiza os dados do produto atual no modal
    modal.dataset.currentProductId = product.id;
}


// Dados do produto (exemplo)
const productData = {
    id: 1,
    name: "Bolo de Chocolate com Brigadeiro",
    price: 79.90,
    oldPrice: 89.90,
    rating: 5,
    servings: "15-20",
    weight: "2.5kg",
    validity: "5 dias refrigerado",
    description: "Delicioso bolo de chocolate com massa super macia e cobertura de brigadeiro cremoso.",
    ingredients: "Farinha de trigo, ovos, açúcar, chocolate em pó, leite integral, manteiga, fermento químico.",
    allergyInfo: "Contém glúten e lactose. Pode conter traços de castanhas e amendoim.",
    image: "bolo-chocolate.jpg",
    tags: ["new", "bestseller"]
};

// Controle do Modal
const modal = document.getElementById('productModal');
const closeBtn = modal.querySelector('.modal-close');

function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Fechar com o botão
closeBtn.addEventListener('click', closeModal);

// Fechar clicando fora
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Controle de quantidade
const quantityControls = modal.querySelector('.controls');
const quantityDisplay = modal.querySelector('.qty-number');
const totalPrice = modal.querySelector('.total-price .value');

let quantity = 1;

function updateQuantity(change) {
    quantity = Math.max(1, quantity + change);
    quantityDisplay.textContent = quantity;
    updateTotal();
}

function updateTotal() {
    const total = productData.price * quantity;
    totalPrice.textContent = formatPrice(total);
}

function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Event listeners para os botões de quantidade
modal.querySelector('.plus').addEventListener('click', () => updateQuantity(1));
modal.querySelector('.minus').addEventListener('click', () => updateQuantity(-1));

// Adicionar à sacola
modal.querySelector('.add-to-cart').addEventListener('click', () => {
    const message = `Olá! Gostaria de encomendar ${quantity}x ${productData.name} por ${formatPrice(productData.price * quantity)}`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeModal();
});

