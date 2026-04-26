/**
 * Otimização de Imagens - Servir WebP com fallback JPEG/PNG
 * Reduz tamanho de imagens em ~30%
 */

(function () {
  // Detecta suporte a WebP
  function supportsWebP() {
    const elem = document.createElement("canvas");
    if (!elem.getContext || !elem.getContext("2d")) {
      return false;
    }
    return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  }

  // Verifica se browser suporta WebP
  const webpSupported = supportsWebP();

  // Se suporta WebP, adiciona classe ao body
  if (webpSupported) {
    document.documentElement.classList.add("webp");
  } else {
    document.documentElement.classList.add("no-webp");
  }

  // Função para converter imagem para WebP
  function convertToWebP(imgElement) {
    if (!webpSupported) return;

    const src = imgElement.src || imgElement.dataset.src;
    if (!src) return;

    // Verifica se é JPEG ou PNG
    if (/\.(jpg|jpeg|png)$/i.test(src)) {
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, ".webp");

      // Se é img tag com src, substitui
      if (imgElement.tagName === "IMG") {
        imgElement.srcset = webpSrc + " 1x";
        // Adiciona fallback
        const source = document.createElement("source");
        source.srcset = webpSrc;
        source.type = "image/webp";
        imgElement.parentElement.insertBefore(source, imgElement);
      }
    }
  }

  // Aplica em todas as imagens quando DOM carrega
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("img").forEach(convertToWebP);

    // Observa novas imagens adicionadas dinamicamente
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(function (node) {
            if (node.querySelectorAll) {
              node.querySelectorAll("img").forEach(convertToWebP);
            } else if (node.tagName === "IMG") {
              convertToWebP(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });

  console.log("✅ Otimização WebP ativada. Suporte: " + webpSupported);
})();
