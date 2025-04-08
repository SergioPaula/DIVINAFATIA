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

}