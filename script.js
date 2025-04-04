let currentIndex = 0; // Começa com o primeiro conjunto de 5 itens
const container = document.querySelector('.carousel-container');
const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;
const itemsToShow = 5; // Número de itens que serão exibidos ao mesmo tempo
const itemWidth = items[0].offsetWidth; // Largura de cada item

let isTransitioning = false; // Para evitar múltiplos cliques durante a transição

// Função para mover o carrossel
function moveSlide(step) {
    if (isTransitioning) return;  // Evita múltiplos cliques durante a transição

    isTransitioning = true;
    currentIndex += step;

    // Controle de limites do índice
    if (currentIndex < 0) {
        currentIndex = 0;  // Impede que o índice fique negativo
    } else if (currentIndex >= Math.ceil(totalItems / itemsToShow)) {  // Impede que o índice ultrapasse o número de grupos
        currentIndex = Math.ceil(totalItems / itemsToShow) - 1;
    }

    container.style.transition = "transform 0.5s ease-in-out";  // Transição suave
    updateCarousel();

    // Após a transição, permite novos cliques
    setTimeout(() => {
        isTransitioning = false;
    }, 500); // Ajuste o tempo conforme necessário
}

// Atualiza a posição do carrossel
function updateCarousel() {
    container.style.transform = `translateX(-${currentIndex * (itemsToShow * itemWidth)}px)`;  // Atualiza a posição do carrossel
}

// Adiciona eventos para os botões de navegação
document.addEventListener("DOMContentLoaded", () => {
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    prevButton.addEventListener('click', () => {
        moveSlide(-1); // Mover para a esquerda
        resetAutoSlide(); // Reseta o auto slide ao clicar
    });

    nextButton.addEventListener('click', () => {
        moveSlide(1); // Mover para a direita
        resetAutoSlide(); // Reseta o auto slide ao clicar
    });

    updateCarousel(); // Atualiza a posição inicial
    startAutoSlide(); // Inicia o slide automático
});

// Função para iniciar o slide automático
let autoSlide;
function startAutoSlide() {
    autoSlide = setInterval(() => moveSlide(1), 4000); // Movendo para a direita a cada 4 segundos
}

// Função para resetar o slide automático
function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide(); // Reinicia o slide automático
}

// Função para adicionar o nome no cabeçalho
document.addEventListener("DOMContentLoaded", function () {
    let header = document.querySelector("header");
    let nome = document.createElement("h1");
    nome.classList.add("nome-header");
    nome.textContent = "ANNA COSTA";
    header.appendChild(nome);
});

// Função para verificar se as seções estão visíveis
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");

    function verificarSeVisivel() {
        sections.forEach(section => {
            const posicao = section.getBoundingClientRect().top;
            const alturaTela = window.innerHeight * 0.85;

            if (posicao < alturaTela) {
                section.classList.add("mostrar");
            }
        });
    }

    window.addEventListener("scroll", verificarSeVisivel);
    verificarSeVisivel(); // Executa na inicialização
});

// Scroll suave entre as seções
document.querySelectorAll('a[href^="#"]').forEach(ancora => {
    ancora.addEventListener('click', function (e) {
      e.preventDefault();
  
      const destino = document.querySelector(this.getAttribute('href'));
      if (destino) {
        destino.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  