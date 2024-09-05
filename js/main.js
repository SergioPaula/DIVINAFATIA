var swiper = new Swiper(".cardapio-produtos", {
  slidesPerView: 3,
  spaceBetween: 30,
  freeMode: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
