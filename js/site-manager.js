/* JavaScript Fix & Organization - Anna Costa Studio */

class SiteManager {
  constructor() {
    this.components = new Map();
    this.isInitialized = false;
    this.init();
  }

  init() {
    // Aguardar DOM estar pronto
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.initializeComponents()
      );
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Inicializar componentes em ordem de prioridade
      this.initNavigation();
      this.initVisualEffects();
      this.initFAQ();
      this.initGallery();
      this.initPerformanceOptimizations();

      this.isInitialized = true;
      console.log("✅ Site Manager inicializado com sucesso");
    } catch (error) {
      console.error("❌ Erro na inicialização:", error);
      // Fallback para funcionalidade básica
      this.initBasicFunctionality();
    }
  }

  initNavigation() {
    // Navegação suave
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    // Active link highlighting
    this.setupActiveNavigation();
  }

  setupActiveNavigation() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${sectionId}`) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-50px 0px -50px 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  initVisualEffects() {
    // Só inicializar em desktop para performance
    if (window.innerWidth > 768) {
      this.setupParallax();
      this.setupHoverEffects();
    }

    // Efeitos leves para todos os dispositivos
    this.setupIntersectionAnimations();
  }

  setupParallax() {
    const parallaxElements = document.querySelectorAll(".parallax-element");
    if (parallaxElements.length === 0) return;

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      parallaxElements.forEach((element) => {
        const rate = scrolled * -0.3;
        element.style.transform = `translate3d(0, ${rate}px, 0)`;
      });
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  setupHoverEffects() {
    const morphButtons = document.querySelectorAll(".morph-button");
    morphButtons.forEach((button) => {
      button.addEventListener("mouseenter", (e) => {
        this.createRipple(e.target, e);
      });
    });
  }

  createRipple(element, event) {
    const ripple = document.createElement("span");
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
      z-index: 1;
    `;

    element.style.position = "relative";
    element.style.overflow = "hidden";
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  setupIntersectionAnimations() {
    const animatedElements = document.querySelectorAll(
      ".card, .trabalho-card, .service-card, .faq-item"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.animation = "slideInUp 0.6s ease forwards";
              entry.target.style.opacity = "1";
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    animatedElements.forEach((el) => {
      el.style.opacity = "0";
      observer.observe(el);
    });
  }

  initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    if (faqItems.length === 0) return;

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      const icon = item.querySelector(".faq-icon i");

      if (!question || !answer || !icon) return;

      question.addEventListener("click", () => {
        this.toggleFAQ(item, answer, icon);
      });

      // Keyboard support
      question.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleFAQ(item, answer, icon);
        }
      });

      // Accessibility
      question.setAttribute("tabindex", "0");
      question.setAttribute("role", "button");
      question.setAttribute("aria-expanded", "false");
    });
  }

  toggleFAQ(item, answer, icon) {
    const isOpen = item.classList.contains("faq-open");

    // Fechar todas as outras FAQs
    document.querySelectorAll(".faq-item").forEach((faqItem) => {
      if (faqItem !== item) {
        faqItem.classList.remove("faq-open");
        const otherAnswer = faqItem.querySelector(".faq-answer");
        const otherIcon = faqItem.querySelector(".faq-icon i");
        if (otherAnswer) otherAnswer.style.maxHeight = "0";
        if (otherIcon) otherIcon.style.transform = "rotate(0deg)";

        const otherQuestion = faqItem.querySelector(".faq-question");
        if (otherQuestion) otherQuestion.setAttribute("aria-expanded", "false");
      }
    });

    if (!isOpen) {
      item.classList.add("faq-open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      icon.style.transform = "rotate(45deg)";
      item.querySelector(".faq-question").setAttribute("aria-expanded", "true");

      // Smooth scroll to item
      setTimeout(() => {
        item.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }
  }

  initGallery() {
    const galleryImages = document.querySelectorAll(".identity-image img");

    galleryImages.forEach((img) => {
      img.addEventListener("click", (e) => {
        this.openImageModal(e.target);
      });

      // Lazy loading
      if ("loading" in HTMLImageElement.prototype) {
        img.loading = "lazy";
      }
    });
  }

  openImageModal(img) {
    const modal = document.createElement("div");
    modal.className = "image-modal";
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      cursor: pointer;
      animation: modalFadeIn 0.3s ease;
    `;

    const modalImg = document.createElement("img");
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalImg.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      border-radius: var(--radius-xl);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      animation: modalImageZoom 0.3s ease;
    `;

    modal.appendChild(modalImg);
    document.body.appendChild(modal);

    // Fechar modal
    modal.addEventListener("click", () => modal.remove());

    // Fechar com ESC
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        modal.remove();
        document.removeEventListener("keydown", handleEsc);
      }
    };
    document.addEventListener("keydown", handleEsc);

    // Prevent body scroll
    document.body.style.overflow = "hidden";
    modal.addEventListener("click", () => {
      document.body.style.overflow = "auto";
    });
  }

  initPerformanceOptimizations() {
    // Preload critical resources
    this.preloadCriticalImages();

    // Debounce scroll events
    this.debounceScrollEvents();

    // Optimize animations for mobile
    if (window.innerWidth <= 768) {
      document.documentElement.style.setProperty(
        "--animation-duration",
        "0.2s"
      );
    }
  }

  preloadCriticalImages() {
    const criticalImages = ["imagens/essa.jpeg", "imagens/flutuante.jpeg"];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
  }

  debounceScrollEvents() {
    let scrollTimeout;
    const originalScroll = window.onscroll;

    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (originalScroll) originalScroll();
      }, 16); // 60fps
    });
  }

  initBasicFunctionality() {
    // Funcionalidade mínima em caso de erro
    console.log("🔧 Inicializando funcionalidade básica");

    // Navegação básica
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  // Método público para reinicializar componente específico
  reinitializeComponent(componentName) {
    try {
      switch (componentName) {
        case "navigation":
          this.initNavigation();
          break;
        case "faq":
          this.initFAQ();
          break;
        case "gallery":
          this.initGallery();
          break;
        default:
          console.warn(`Componente ${componentName} não encontrado`);
      }
    } catch (error) {
      console.error(`Erro ao reinicializar ${componentName}:`, error);
    }
  }
}

// CSS adicional para animações
const additionalStyles = `
  <style>
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes modalImageZoom {
      from { transform: scale(0.8); }
      to { transform: scale(1); }
    }
    
    .image-modal {
      backdrop-filter: blur(5px);
    }
    
    /* Performance optimizations */
    .card, .trabalho-card, .service-card {
      will-change: transform, opacity;
    }
    
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
`;

document.head.insertAdjacentHTML("beforeend", additionalStyles);

// Inicializar o site manager globalmente
window.siteManager = new SiteManager();

// Exportar para uso em outros scripts se necessário
if (typeof module !== "undefined" && module.exports) {
  module.exports = SiteManager;
}
