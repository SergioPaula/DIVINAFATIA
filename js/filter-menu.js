// Script corrigido de filtro do cardápio
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o cardápio quando a página carregar
    cardapio.eventos.init();
    
    // Adicionar interação aos filtros de categoria
    const itemsFilter = document.querySelectorAll('.item-filter');
    itemsFilter.forEach(item => {
        item.addEventListener('click', () => {
            const filtroContainer = item.closest('.filtro-produto');
            const textFilter = filtroContainer.querySelector('.text-filtro');
            const categoria = textFilter.getAttribute('data-category');
            
            // Se o texto clicado já está ativo, apenas remove a classe (reset)
            if (textFilter.classList.contains('active')) {
                textFilter.classList.remove('active');
                cardapio.metodos.filtrarProdutos('Todos');
            } else {
                // Se não, remove de todos e adiciona no clicado
                document.querySelectorAll('.text-filtro').forEach(text => {
                    text.classList.remove('active');
                });
                
                textFilter.classList.add('active');
                cardapio.metodos.filtrarProdutos(categoria);
            }
        });
    });
    
    // Adicionar interação aos filtros de tags
    const tagFilters = document.querySelectorAll('.filter-tag');
    tagFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Se a tag já está ativa, desativa-a
            if (filter.classList.contains('active')) {
                filter.classList.remove('active');
                // Limpar o filtro de tags
                cardapio.metodos.aplicarFiltrosTags([]);
            } else {
                // Desativar todas as outras tags
                document.querySelectorAll('.filter-tag').forEach(tag => {
                    tag.classList.remove('active');
                });
                
                // Ativar apenas esta tag
                filter.classList.add('active');
                
                // Identificar qual tag foi ativada
                let tagType = '';
                const tagSpan = filter.querySelector('span');
                if (tagSpan.classList.contains('filter-tag-promo') || tagSpan.classList.contains('tag-promo')) {
                    tagType = 'promo';
                } else if (tagSpan.classList.contains('filter-tag-news') || tagSpan.classList.contains('tag-news')) {
                    tagType = 'news';
                } else if (tagSpan.classList.contains('filter-tag-hot') || tagSpan.classList.contains('tag-hot')) {
                    tagType = 'hot';
                }
                
                // Aplicar filtro com a tag selecionada
                if (tagType) {
                    cardapio.metodos.aplicarFiltrosTags([tagType]);
                }
            }
        });
    });
    
    // Adicionar estilos de destaque para os filtros
    const style = document.createElement('style');
    style.textContent = `
        .filter-tag.active .tag {
            transform: scale(1.05);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .filter-tag.active .filter-tag-promo, .filter-tag.active .tag-promo {
            background-color: #FFB2B8 !important;
            font-weight: var(--font-weight-extrabold);
        }
        .filter-tag.active .filter-tag-news, .filter-tag.active .tag-news {
            background-color: #B2B7FF !important;
            font-weight: var(--font-weight-extrabold);
        }
        .filter-tag.active .filter-tag-hot, .filter-tag.active .tag-hot {
            background-color: #FFEB99 !important;
            font-weight: var(--font-weight-extrabold);
        }
    `;
    document.head.appendChild(style);
});

// Namespace para o cardápio
var cardapio = {};

// Estado atual dos filtros
cardapio.filtros = {
    categoria: 'Todos',
    tagsAtivas: []
};

// Eventos do cardápio
cardapio.eventos = {
    init: () => {
        cardapio.metodos.obterItensCardapio();
    }
}

// Métodos do cardápio
cardapio.metodos = {
    // Obtém todos os itens e armazena para uso futuro
    obterItensCardapio: () => {
        // Armazenar todos os produtos em uma variável global para facilitar a filtragem
        cardapio.produtos = MENU['bolos'];
        
        // Configurar os atributos data-category nos elementos de filtro se ainda não existirem
        cardapio.metodos.inicializarFiltros();
        
        // Renderizar todos os produtos inicialmente
        cardapio.metodos.filtrarProdutos('Todos');
    },
    
    // Função para inicializar os filtros
    inicializarFiltros: () => {
        // Adicionar data-category aos elementos de filtro
        document.querySelectorAll('.text-filtro').forEach(textFilter => {
            const texto = textFilter.textContent.trim();
            
            // Mapear o texto para a categoria correta
            let categoria = 'Todos';
            if (texto.includes('Sem Cobertura')) categoria = 'Bolos sem Cobertura';
            if (texto.includes('Com Cobertura') && !texto.includes('Bastante')) categoria = 'Bolos com Cobertura';
            if (texto.includes('Bastante Cobertura')) categoria = 'Bolos com Bastante Cobertura';
            
            // Armazenar a categoria como atributo
            if (!textFilter.hasAttribute('data-category')) {
                textFilter.setAttribute('data-category', categoria);
            }
        });
        
        // Adicionar data-tag aos elementos de filtro de tag, se necessário
        document.querySelectorAll('.filter-tag').forEach(tagFilter => {
            if (!tagFilter.hasAttribute('data-tag')) {
                const tagSpan = tagFilter.querySelector('span');
                if (tagSpan) {
                    if (tagSpan.classList.contains('filter-tag-promo') || tagSpan.classList.contains('tag-promo')) {
                        tagFilter.setAttribute('data-tag', 'promo');
                    } else if (tagSpan.classList.contains('filter-tag-news') || tagSpan.classList.contains('tag-news')) {
                        tagFilter.setAttribute('data-tag', 'news');
                    } else if (tagSpan.classList.contains('filter-tag-hot') || tagSpan.classList.contains('tag-hot')) {
                        tagFilter.setAttribute('data-tag', 'hot');
                    }
                }
            }
        });
    },
    
    // Função para filtrar produtos por categoria
    filtrarProdutos: (categoria) => {
        // Atualizar o estado atual da categoria
        cardapio.filtros.categoria = categoria;
        
        // Aplicar filtros combinados (categoria + tags)
        cardapio.metodos.aplicarFiltrosCombinados();
    },
    
    // Função para aplicar filtros por tags
    aplicarFiltrosTags: (tagsAtivas) => {
        // Atualizar o estado atual das tags
        cardapio.filtros.tagsAtivas = tagsAtivas || [];
        
        // Aplicar filtros combinados (categoria + tags)
        cardapio.metodos.aplicarFiltrosCombinados();
    },
    
    // Função para aplicar filtros combinados (categoria + tags)
    aplicarFiltrosCombinados: () => {
        // Limpar o container
        document.getElementById("itensCardapio").innerHTML = '';
        
        // Filtrar produtos por categoria
        let produtosFiltrados = cardapio.produtos;
        
        if (cardapio.filtros.categoria !== 'Todos') {
            produtosFiltrados = produtosFiltrados.filter(p => p.category === cardapio.filtros.categoria);
        }
        
        // Filtrar por tags se houver tags ativas
        if (cardapio.filtros.tagsAtivas && cardapio.filtros.tagsAtivas.length > 0) {
            produtosFiltrados = produtosFiltrados.filter(produto => {
                return cardapio.filtros.tagsAtivas.some(tag => produto.tags[tag]);
            });
        }
        
        // Renderizar produtos filtrados
        produtosFiltrados.forEach(produto => {
            cardapio.metodos.renderizarProduto(produto);
        });
        
        // Se não encontrou produtos, mostrar mensagem
        if (produtosFiltrados.length === 0) {
            const mensagem = document.createElement('div');
            mensagem.className = 'no-products-message swiper-slide';
            mensagem.style.display = 'flex';
            mensagem.style.justifyContent = 'center';
            mensagem.style.alignItems = 'center';
            mensagem.style.padding = '2rem';
            mensagem.style.width = '100%';
            mensagem.innerHTML = '<p>Nenhum produto encontrado com os filtros selecionados</p>';
            document.getElementById("itensCardapio").appendChild(mensagem);
        }
        
        // Atualizar o Swiper se existir
        if (window.swiper) {
            setTimeout(() => {
                window.swiper.update();
            }, 100);
        }
    },
    
    // Função para renderizar um produto individual
    renderizarProduto: (produto) => {
        // Gerar HTML para tags
        let tagsHTML = '';
        if (produto.tags.promo) tagsHTML += '<span class="tag promo">Promoção</span>';
        if (produto.tags.news) tagsHTML += '<span class="tag news">Novidade</span>';
        if (produto.tags.hot) tagsHTML += '<span class="tag hot">Mais Vendido</span>';
        
        // Gerar HTML para rating (estrelas)
        let ratingHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(produto.rating)) {
                // Estrela cheia
                ratingHTML += `<svg><use href="./img/ICONS/icones-gerais.svg#star-full"></use></svg>`;
            } else if (i - 0.5 <= produto.rating) {
                // Estrela meio cheia (se o rating tiver parte decimal)
                ratingHTML += `<svg><use href="./img/ICONS/icones-gerais.svg#star-half"></use></svg>`;
            } else {
                // Estrela vazia
                ratingHTML += `<svg class="star-line"><use href="./img/ICONS/icones-gerais.svg#star-line"></use></svg>`;
            }
        }
        
        // Formatação de preços
        const oldPrice = produto.oldPrice ? `R$ ${produto.oldPrice.toFixed(2).replace('.', ',')}` : '';
        const currentPrice = `R$ ${produto.currentPrice.toFixed(2).replace('.', ',')}`;
        
        // Verificar se há preço antigo para mostrar
        const oldPriceHTML = produto.oldPrice ? `<span class="old-price">${oldPrice}</span>` : '';
        
        // Tratamento para imagem padrão se não houver cardImage
        const imgSrc = produto.cardImage || './img/PRODUTOS/placeholder.jpg';
        
        // Criar o elemento do slide
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <article class="product-card" data-category="${produto.category}" data-id="${produto.id}">
                <figure class="card-image card-clickable" data-product-id="${produto.id}">
                    <img src="${imgSrc}" alt="${produto.name}" />
                    <div class="tags">
                        ${tagsHTML}
                    </div>
                    <div class="title-overlay">
                        <h2>${produto.name}</h2>
                    </div>
                </figure>

                <div class="card-content">
                    <div class="rating">
                        ${ratingHTML}
                        <p class="avaliacoes">${produto.reviewCount} Avaliações</p>
                    </div>

                    <p class="description">${produto.metaDescription}</p>

                    <div class="price-container">
                        ${oldPriceHTML}
                        <span class="current-price">${currentPrice}</span>
                        <p class="medida-unidade">/un</p>
                    </div>

                    <div class="purchase-controls">
                        <div class="quantity">
                            <button class="qty-btn minus" data-product="${produto.id}">-</button>
                            <span class="qty-display">1</span>
                            <button class="qty-btn plus" data-product="${produto.id}">+</button>
                        </div>
                        <button class="add-to-cart" data-product="${produto.id}">
                            Adicionar à Sacola
                        </button>
                    </div>
                </div>
            </article>
        `;
        
        // Adicionar o slide ao container
        document.getElementById('itensCardapio').appendChild(slide);
        
        // Configurar controles de quantidade e botão de adicionar ao carrinho após inserir o produto
        const quantityContainer = slide.querySelector('.quantity');
        if (quantityContainer && typeof setupQuantityControls === 'function') {
            setupQuantityControls(quantityContainer);
        }
        
        const addToCartButton = slide.querySelector('.add-to-cart');
        if (addToCartButton && typeof setupAddToCartButtons === 'function') {
            setupAddToCartButtons();
        }
    }
};