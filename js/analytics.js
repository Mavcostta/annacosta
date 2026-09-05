// Google Analytics 4 + Event Tracking (opcional)
// Anna Costa Studio - Monitoramento de Conversões

// Rastreamento de Cliques no WhatsApp
document.addEventListener("DOMContentLoaded", function () {
  const whatsappLinks = document.querySelectorAll(
    'a[href*="wa.me"], a[href*="whatsapp"]'
  );

  whatsappLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (typeof gtag !== "undefined") {
        gtag("event", "whatsapp_click", {
          event_category: "Conversão",
          event_label: "WhatsApp - " + (this.textContent || "Link"),
          value: 1,
        });
      }

      console.log("WhatsApp click tracked");
    });
  });

  // Rastreamento de Cliques no Telefone
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

  phoneLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (typeof gtag !== "undefined") {
        gtag("event", "phone_call", {
          event_category: "Conversão",
          event_label: "Telefone - " + this.href.replace("tel:", ""),
          value: 1,
        });
      }

      console.log("Phone call tracked");
    });
  });

  // Rastreamento de Links para Páginas de Serviços
  const serviceLinks = document.querySelectorAll(
    'a[href*="cilios-guarulhos"], a[href*="sobrancelhas-guarulhos"], a[href*="lifting"], a[href*="lamination"]'
  );

  serviceLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const serviceName = this.href.split("/").pop().replace(".html", "");

      if (typeof gtag !== "undefined") {
        gtag("event", "view_service", {
          event_category: "Navegação",
          event_label: serviceName,
          value: 1,
        });
      }

      console.log("Service page view tracked:", serviceName);
    });
  });

  // Rastreamento de Scroll Profundidade
  let scrolled25 = false,
    scrolled50 = false,
    scrolled75 = false,
    scrolled100 = false;

  window.addEventListener("scroll", function () {
    const scrollPercentage =
      ((window.scrollY + window.innerHeight) /
        document.documentElement.scrollHeight) *
      100;

    if (scrollPercentage >= 25 && !scrolled25) {
      scrolled25 = true;
      if (typeof gtag !== "undefined") {
        gtag("event", "scroll_depth", {
          event_category: "Engajamento",
          event_label: "25%",
          value: 25,
        });
      }
    }

    if (scrollPercentage >= 50 && !scrolled50) {
      scrolled50 = true;
      if (typeof gtag !== "undefined") {
        gtag("event", "scroll_depth", {
          event_category: "Engajamento",
          event_label: "50%",
          value: 50,
        });
      }
    }

    if (scrollPercentage >= 75 && !scrolled75) {
      scrolled75 = true;
      if (typeof gtag !== "undefined") {
        gtag("event", "scroll_depth", {
          event_category: "Engajamento",
          event_label: "75%",
          value: 75,
        });
      }
    }

    if (scrollPercentage >= 100 && !scrolled100) {
      scrolled100 = true;
      if (typeof gtag !== "undefined") {
        gtag("event", "scroll_depth", {
          event_category: "Engajamento",
          event_label: "100%",
          value: 100,
        });
      }
    }
  });

  // Rastreamento de Tempo na Página
  let timeOnPage = 0;
  const timeInterval = setInterval(() => {
    timeOnPage += 30;

    // Track em marcos importantes
    if (timeOnPage === 30 && typeof gtag !== "undefined") {
      gtag("event", "time_on_page", {
        event_category: "Engajamento",
        event_label: "30 segundos",
        value: 30,
      });
    }

    if (timeOnPage === 60 && typeof gtag !== "undefined") {
      gtag("event", "time_on_page", {
        event_category: "Engajamento",
        event_label: "1 minuto",
        value: 60,
      });
    }

    if (timeOnPage === 120 && typeof gtag !== "undefined") {
      gtag("event", "time_on_page", {
        event_category: "Engajamento",
        event_label: "2 minutos",
        value: 120,
      });
    }
  }, 30000); // Check a cada 30 segundos

  // Rastreamento de Cliques em Redes Sociais
  const socialLinks = document.querySelectorAll(
    'a[href*="instagram"], a[href*="tiktok"], a[href*="facebook"]'
  );

  socialLinks.forEach((link) => {
    link.addEventListener("click", function () {
      let platform = "Unknown";
      if (this.href.includes("instagram")) platform = "Instagram";
      if (this.href.includes("tiktok")) platform = "TikTok";
      if (this.href.includes("facebook")) platform = "Facebook";

      if (typeof gtag !== "undefined") {
        gtag("event", "social_click", {
          event_category: "Social Media",
          event_label: platform,
          value: 1,
        });
      }

      console.log("Social media click tracked:", platform);
    });
  });

  // Rastreamento de Visualizações de Galeria
  const galleryImages = document.querySelectorAll(
    ".gallery-item img, .service img"
  );

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imgAlt = entry.target.alt || "Imagem sem descrição";

            if (typeof gtag !== "undefined") {
              gtag("event", "image_view", {
                event_category: "Galeria",
                event_label: imgAlt.substring(0, 50),
                value: 1,
              });
            }

            imageObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    galleryImages.forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Rastreamento de Saída da Página
  window.addEventListener("beforeunload", function () {
    if (typeof gtag !== "undefined") {
      gtag("event", "page_exit", {
        event_category: "Engajamento",
        event_label: "Tempo total: " + Math.floor(timeOnPage / 60) + "min",
        value: timeOnPage,
      });
    }
  });
});

// Função para rastreamento manual de conversões
function trackConversion(conversionName, value = 1) {
  if (typeof gtag !== "undefined") {
    gtag("event", "conversion", {
      event_category: "Conversão Manual",
      event_label: conversionName,
      value: value,
    });
  }

  console.log("Manual conversion tracked:", conversionName);
}

// Expor função globalmente para uso no HTML
window.trackConversion = trackConversion;
