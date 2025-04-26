const itemsFilter = document.querySelectorAll('.item-filter');

itemsFilter.forEach(item => {
    item.addEventListener('click', () => {
        const textFilter = item.closest('.filtro-produto').querySelector('.text-filtro');

        // Se o texto clicado já está ativo, apenas remove a classe (esconde)
        if (textFilter.classList.contains('active')) {
            textFilter.classList.remove('active');
            return;
        }

        // Se não, remove de todos e adiciona no clicado
        document.querySelectorAll('.text-filtro').forEach(text => {
            text.classList.remove('active');
        });

        textFilter.classList.add('active');
    });
});


//ORIENTAÇÃO DO CURSO KIWIFY

$(document).ready(function () {
    cardapio.eventos.init();
})


var cardapio = {};

cardapio.eventos = {
    init: () => {
        console.log('iniciou')
    }
}

cardapio.metodos = {

    //Obtem a lista de itens do cardapio
    obterItensCardapio: () => {
        var filtro = MENU['Bolos sem Cobertura'];
        console.log(filtro);
    }

}

cardapio.templates = {

    <div class="swiper-slide" >
        <article class="product-card" data-category="sem-cobertura">
            <figure class="card-image">
                <img src="./img/PRODUTOS/01-chocolate/01.png" alt="Bolo de Chocolate" />
                <div class="tags">
                    <span class="tag sale">Promoção</span>
                </div>
                <div class="title-overlay">
                    <h2>Bolo de Chocolate <br>com Brigadeiro e Granulado</h2>
                </div>
            </figure>

            <div class="card-content">
                <div class="rating">
                    <svg>
                        <use href="./img/ICONS/icones-gerais.svg#star-full"></use>
                    </svg>
                    <svg>
                        <use href="./img/ICONS/icones-gerais.svg#star-full"></use>
                    </svg>
                    <svg>
                        <use href="./img/ICONS/icones-gerais.svg#star-full"></use>
                    </svg>
                    <svg>
                        <use href="./img/ICONS/icones-gerais.svg#star-full"></use>
                    </svg>
                    <svg class="star-line">
                        <use href="./img/ICONS/icones-gerais.svg#star-line"></use>
                    </svg>

                    <p class="avaliacoes">236 Avaliações</p>
                </div>


                <p class="description">Delicioso bolo de chocolate coberto com brigadeiro cremoso e
                    chocolate belga ralado. Uma explosão de sabor para os amantes de chocolate.</p>

                <div class="price-container">
                    <span class="old-price">R$ 89,90</span>
                    <span class="current-price">R$ 129,90</span>
                    <p class="medida-unidade">/un</p>
                </div>

                <div class="purchase-controls">
                    <div class="quantity">
                        <button class="qty-btn minus" data-product="1">-</button>
                        <span class="qty-display">1</span>
                        <button class="qty-btn plus" data-product="1">+</button>
                    </div>
                    <button class="add-to-cart" data-product="1">
                        Adicionar à Sacola
                    </button>
                </div>
            </div>
        </article>
    </div>

}