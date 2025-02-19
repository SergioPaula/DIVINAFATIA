var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 10,

    // Configuração dos botões de navegação
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },


    breakpoints: {
        640: {
            slidesPerView: 1.5,
            spaceBetween: 32,
        },
        768: {
            slidesPerView: 3.5,
            spaceBetween: 32,
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 32,
        },
    },
});

