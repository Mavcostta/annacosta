// GA4 só carrega após consentimento explícito.
(() => {
  if (window.pushAnalyticsEvent) return;
  const GA4_MEASUREMENT_ID = "G-EMDNPLS1H3";
  const CONSENT_KEY = "studio_anna_analytics_consent";
  const CONSENT_DURATION = 180 * 24 * 60 * 60 * 1000;
  const page = document.body.dataset.page;
  const service = document.body.dataset.service || "general";
  let consent = false;
  let ga4Loaded = false;
  const thresholds = new Set();
  const events = new Set([
    "whatsapp_click", "select_service", "social_click",
    "google_reviews_click", "portfolio_view", "scroll_depth",
  ]);

  function push(value) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(value);
      return true;
    } catch {
      return false; // Analytics indisponível nunca interrompe o site.
    }
  }

  function consentCommand(action, state) {
    function command() { return push(arguments); }
    return command("consent", action, {
      analytics_storage: state,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }

  consentCommand("default", "denied");

  window.pushAnalyticsEvent = (eventName, params = {}) => {
    if (!consent || !events.has(eventName)) return false;
    function command() { return push(arguments); }
    return command("event", eventName, { ...params, page });
  };

  // Ponto único usado pelo controle de consentimento.
  window.setAnalyticsConsent = (granted) => {
    consent = granted === true;
    const updated = consentCommand("update", consent ? "granted" : "denied");
    if (!updated) consent = false;
    if (!consent || ga4Loaded) return;
    try {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
      function command() { return push(arguments); }
      if (!command("js", new Date()) ||
          !command("config", GA4_MEASUREMENT_ID)) return;
      document.head.appendChild(script);
      ga4Loaded = true;
    } catch {
      // Bloqueadores ou falhas de rede não afetam navegação.
    }
  };

  function savedConsent() {
    try {
      const choice = JSON.parse(localStorage.getItem(CONSENT_KEY));
      if (choice?.expires > Date.now() && typeof choice.granted === "boolean")
        return choice.granted;
      localStorage.removeItem(CONSENT_KEY);
    } catch {
      // Armazenamento bloqueado mantém o consentimento negado por padrão.
    }
    return null;
  }

  function saveConsent(granted) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        granted,
        expires: Date.now() + CONSENT_DURATION,
      }));
    } catch {
      // A decisão ainda vale durante a página atual.
    }
  }

  function setupConsentControl() {
    if (!document.body.insertAdjacentHTML) return;
    // Componente visual adaptado de Uiverse.io por 00Kubi.
    document.body.insertAdjacentHTML("beforeend", `
      <section class="cookie-consent-card" id="cookie-consent" role="dialog" aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-description" hidden>
        <span class="cookie-consent-icon" aria-hidden="true">🍪</span>
        <h2 id="cookie-consent-title">Sua privacidade importa</h2>
        <p id="cookie-consent-description">Usamos cookies de análise para entender como nosso site é utilizado e melhorar sua experiência. Você escolhe se deseja permitir.</p>
        <button class="cookie-consent-more" id="cookie-consent-more" type="button" aria-expanded="false" aria-controls="cookie-consent-details">Saiba mais sobre privacidade</button>
        <p class="cookie-consent-details" id="cookie-consent-details" hidden>O analytics é opcional. A recusa não afeta a navegação, e você pode mudar sua escolha a qualquer momento.</p>
        <div class="cookie-consent-actions">
          <button class="cookie-consent-accept" id="cookie-consent-accept" type="button">Permitir</button>
          <button class="cookie-consent-decline" id="cookie-consent-decline" type="button">Recusar</button>
        </div>
      </section>
    `);
    const card = document.getElementById("cookie-consent");
    const more = document.getElementById("cookie-consent-more");
    const details = document.getElementById("cookie-consent-details");
    const showCard = () => {
      card.hidden = false;
      document.getElementById("cookie-consent-accept").focus();
    };
    const choose = (granted) => {
      saveConsent(granted);
      window.setAnalyticsConsent(granted);
      card.hidden = true;
    };

    document.getElementById("cookie-consent-accept")
      .addEventListener("click", () => choose(true));
    document.getElementById("cookie-consent-decline")
      .addEventListener("click", () => choose(false));
    more.addEventListener("click", () => {
      details.hidden = !details.hidden;
      more.setAttribute("aria-expanded", String(!details.hidden));
    });

    const choice = savedConsent();
    if (choice === null) showCard();
    else window.setAnalyticsConsent(choice);
  }

  setupConsentControl();

  const clickEvents = {
    whatsapp: "whatsapp_click",
    service: "select_service",
    social: "social_click",
    google_reviews: "google_reviews_click",
  };
  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[data-track]");
    if (!link || event.defaultPrevented) return;
    const action = link.dataset.track;
    const params = { cta_location: link.dataset.location };
    if (action === "whatsapp" || action === "service")
      params.service = link.dataset.service || service;
    if (action === "social") params.platform = link.dataset.platform;
    window.pushAnalyticsEvent(clickEvents[action], params);
  });

  window.addEventListener("scroll", () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (height <= 0) return;
    const percent = window.scrollY / height * 100;
    for (const threshold of [50, 90]) {
      if (percent >= threshold && !thresholds.has(threshold) &&
          window.pushAnalyticsEvent("scroll_depth", { percent: threshold }))
        thresholds.add(threshold);
    }
  }, { passive: true });
})();
