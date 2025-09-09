let currentIndex = 0;
const container = document.querySelector(".carousel-container");
const items = document.querySelectorAll(".carousel-item");
const totalItems = items.length;
itemsToShow = getItemsToShow(); // Agora é dinâmico

let isTransitioning = false;

function getItemWidth() {
  return items[0].offsetWidth;
}

function getItemsToShow() {
  const screenWidth = window.innerWidth;
  if (screenWidth < 500) return 1;
  if (screenWidth < 768) return 2;
  if (screenWidth < 1024) return 3;
  return 5;
}

function moveSlide(step) {
  if (isTransitioning) return;

  isTransitioning = true;
  itemsToShow = getItemsToShow(); // Recalcula sempre que mover
  currentIndex += step;

  const maxIndex = Math.ceil(totalItems / itemsToShow) - 1;
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > maxIndex) currentIndex = maxIndex;

  container.style.transition = "transform 0.5s ease-in-out";
  updateCarousel();

  setTimeout(() => {
    isTransitioning = false;
  }, 500);
}

function updateCarousel() {
  const itemWidth = getItemWidth();
  container.style.transform = `translateX(-${
    currentIndex * (itemsToShow * itemWidth)
  }px)`;
}

document.addEventListener("DOMContentLoaded", () => {
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");

  prevButton.addEventListener("click", () => {
    moveSlide(-1);
    resetAutoSlide();
  });

  nextButton.addEventListener("click", () => {
    moveSlide(1);
    resetAutoSlide();
  });

  updateCarousel();
  startAutoSlide();
  window.addEventListener("resize", () => {
    itemsToShow = getItemsToShow();
    updateCarousel();
  });
});

let autoSlide;
function startAutoSlide() {
  autoSlide = setInterval(() => moveSlide(1), 4000);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

document.addEventListener("DOMContentLoaded", function () {
  let header = document.querySelector("header");
  let nome = document.createElement("h1");
  nome.classList.add("nome-header");
  nome.textContent = "ANNA COSTA";
  header.appendChild(nome);
});

document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");

  function verificarSeVisivel() {
    sections.forEach((section) => {
      const posicao = section.getBoundingClientRect().top;
      const alturaTela = window.innerHeight * 0.85;

      if (posicao < alturaTela) {
        section.classList.add("mostrar");
      }
    });
  }

  window.addEventListener("scroll", verificarSeVisivel);
  verificarSeVisivel();
});

document.querySelectorAll('a[href^="#"]').forEach((ancora) => {
  ancora.addEventListener("click", function (e) {
    e.preventDefault();
    const destino = document.querySelector(this.getAttribute("href"));
    if (destino) {
      destino.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  menuToggle.classList.toggle("active");

  // Previne scroll quando menu está aberto
  if (navLinks.classList.contains("show")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
});

// Fecha menu ao clicar em um link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    menuToggle.classList.remove("active");
    document.body.style.overflow = "auto";
  });
});

// Fecha menu ao clicar fora
document.addEventListener("click", (e) => {
  if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove("show");
    menuToggle.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Lightbox para galeria
document.addEventListener("DOMContentLoaded", function () {
  const galleryItems = document.querySelectorAll(".gallery-item img");
  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close">&times;</span>
      <img class="lightbox-image" src="" alt="">
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector(".lightbox-image");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const lightboxClose = lightbox.querySelector(".lightbox-close");

  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      lightboxImg.src = this.src;
      lightboxCaption.textContent = this.alt;
      lightbox.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  lightboxClose.addEventListener("click", function () {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
  });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
});

// ===== ANIMAÇÃO ELEGANTE DA LOGO ANNA COSTA =====
document.addEventListener("DOMContentLoaded", function () {
  const butterflyEmoji = document.querySelector(".butterfly-emoji");
  const animatedName = document.querySelector(".animated-name");

  // Adicionar interatividade elegante à borboletinha
  if (butterflyEmoji) {
    butterflyEmoji.addEventListener("click", function () {
      // Criar efeito de "borboletinha dançando" ao clicar
      this.style.animation = "butterflyDance 1.2s ease-in-out";

      // Reset da animação após completar
      setTimeout(() => {
        this.style.animation = "butterflyElegant 3s ease-in-out 4.5s forwards";
      }, 1200);
    });

    // Efeito de brilho sutil ao passar o mouse
    butterflyEmoji.addEventListener("mouseenter", function () {
      this.style.filter =
        "drop-shadow(0 0 20px rgba(210, 108, 164, 0.9)) brightness(1.1)";
      this.style.transform = "scale(1.1) rotate(10deg)";
    });

    butterflyEmoji.addEventListener("mouseleave", function () {
      this.style.filter = "drop-shadow(0 4px 12px rgba(210, 108, 164, 0.5))";
      this.style.transform = "scale(1) rotate(0deg)";
    });
  }

  // Adicionar efeito sutil ao nome quando o mouse passa por cima
  if (animatedName) {
    animatedName.addEventListener("mouseenter", function () {
      this.style.animation =
        "handwriting 4s ease-in-out forwards, nameShine 2s ease-in-out infinite alternate, blinkCursor 1.5s infinite 4s";
    });

    animatedName.addEventListener("mouseleave", function () {
      this.style.animation =
        "handwriting 4s ease-in-out forwards, blinkCursor 1.5s infinite 4s";
    });
  }
});

// PWA Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// Install prompt for PWA
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;

  // Show custom install button or prompt
  console.log("PWA install prompt available");
});

// Performance monitoring
if ("performance" in window && "PerformanceObserver" in window) {
  try {
    // Monitor Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log("LCP:", lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

    // Monitor First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log("FID:", entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ["first-input"] });
  } catch (e) {
    console.log("Performance monitoring not supported");
  }
}
