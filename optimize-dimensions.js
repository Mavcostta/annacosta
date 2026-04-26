/**
 * Otimização de Performance - Detecta e adiciona dimensões em imagens
 * Reduz Cumulative Layout Shift (CLS)
 */

document.addEventListener("DOMContentLoaded", function () {
  // Imagens críticas do hero com suas dimensões reais
  const heroImages = {
    "imagens/flutuante.jpeg": { width: 600, height: 750 },
    "imagens/anna (1).jpeg": { width: 600, height: 750 },
    "imagens/anna (2).jpeg": { width: 600, height: 750 },
    "imagens/anna (3).jpeg": { width: 600, height: 750 },
    "imagens/anna (4).jpeg": { width: 600, height: 750 },
  };

  // Adiciona dimensões nas imagens do hero
  document.querySelectorAll(".hero-image").forEach((img) => {
    const src = img.src;
    for (const [path, dimensions] of Object.entries(heroImages)) {
      if (src.includes(path)) {
        img.setAttribute("width", dimensions.width);
        img.setAttribute("height", dimensions.height);
        break;
      }
    }
  });

  // Adiciona lazy-loading nas imagens não-críticas abaixo do fold
  document.querySelectorAll("img:not(.hero-image)").forEach((img) => {
    // Pula imagens que já têm loading ou fetchpriority definido
    if (!img.getAttribute("loading") && !img.getAttribute("fetchpriority")) {
      img.setAttribute("loading", "lazy");
    }
  });

  // Portfolio carousel - adiciona dimensões
  document.querySelectorAll(".portfolio-item img").forEach((img) => {
    if (!img.getAttribute("width")) {
      img.setAttribute("width", 400);
      img.setAttribute("height", 500);
    }
  });

  // Feedback/testimonials - adiciona dimensões
  document.querySelectorAll(".review-card img").forEach((img) => {
    if (!img.getAttribute("width")) {
      img.setAttribute("width", 60);
      img.setAttribute("height", 60);
    }
  });

  console.log("✅ Dimensões de imagens otimizadas para Performance");
});
