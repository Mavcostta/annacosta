/**
 * Otimização de performance - detecta e adiciona dimensões em imagens
 * Reduz Cumulative Layout Shift (CLS)
 */

document.addEventListener("DOMContentLoaded", function () {
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
