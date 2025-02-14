var swiper = new Swiper('.swiper-container', {
  slidesPerView: 1.5, // Mostra 1 card e meio por vez
  spaceBetween: 10, // Espaço entre os cards
  navigation: {
      nextEl: '.swiper-button-next', // Botão de avançar
      prevEl: '.swiper-button-prev', // Botão de voltar
  },
  breakpoints: {
      640: {
          slidesPerView: 2,
          spaceBetween: 20,
      },
      768: {
          slidesPerView: 3,
          spaceBetween: 30,
      },
      1024: {
          slidesPerView: 4,
          spaceBetween: 40,
      },
  }
});
