let currentIndex = 0;
const container = document.querySelector('.carousel-container');
const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;

function moveSlide(step) {
    currentIndex += step;

    if (currentIndex < 0) {
        currentIndex = totalItems - 1; // Vai para o último item
    } else if (currentIndex >= totalItems) {
        currentIndex = 0; // Volta para o primeiro
    }

    updateCarousel();
}

function updateCarousel() {
    const itemWidth = items[0].offsetWidth;  // Obtém a largura dos itens
    container.style.transition = "transform 0.5s ease";  // Adiciona uma transição suave
    container.style.transform = `translateX(-${currentIndex * itemWidth}px)`;  // Aplica o deslocamento
}

// Adicionando eventos aos botões
document.addEventListener("DOMContentLoaded", () => {
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    // Eventos de clique
    prevButton.addEventListener('click', () => moveSlide(-1));
    nextButton.addEventListener('click', () => moveSlide(1));

    // Atualização inicial do carrossel
    updateCarousel();
});

// Função para adicionar o nome no cabeçalho
document.addEventListener("DOMContentLoaded", function () {
    let header = document.querySelector("header");
    let nome = document.createElement("h1");
    nome.classList.add("nome-header");
    nome.textContent = "ANNA COSTA";
    header.appendChild(nome);
});

// Função para verificar se as seções estão visíveis
document.addEventListener("DOMContentLoaded", function() {
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
