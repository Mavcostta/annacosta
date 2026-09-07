const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const source = fs.readFileSync(path.join(root, "js/analytics.js"), "utf8");
const services = {
  "extensao-cilios-guarulhos": "extensao_cilios",
  "design-sobrancelhas-guarulhos": "design_sobrancelhas",
  "lash-lifting-guarulhos": "lash_lifting",
  "brow-lamination-guarulhos": "brow_lamination",
};
const actions = {
  whatsapp: "whatsapp_click", service: "select_service",
  social: "social_click", google_reviews: "google_reviews_click",
};
const attrs = (tag) => Object.fromEntries(
  [...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]),
);
const dataset = (tag) => Object.fromEntries(
  Object.entries(attrs(tag)).filter(([key]) => key.startsWith("data-"))
    .map(([key, value]) => [key.slice(5), value]),
);

function runtime(page = "home", code = source, ui = false, saved = {}) {
  const listeners = {};
  const scripts = [];
  const storage = new Map(Object.entries(saved));
  const elements = {};
  const listen = (name, fn) => (listeners[name] ||= []).push(fn);
  const element = (id) => elements[id] = {
    hidden: true,
    attributes: {},
    listeners: {},
    addEventListener(name, fn) { this.listeners[name] = fn; },
    click() { this.listeners.click(); },
    focus() {},
    setAttribute(name, value) { this.attributes[name] = value; },
  };
  const body = { dataset: { page, service: services[page] || "general" } };
  if (ui) body.insertAdjacentHTML = () => [
    "cookie-consent", "cookie-consent-more",
    "cookie-consent-details", "cookie-consent-accept", "cookie-consent-decline",
  ].forEach(element);
  const document = {
    body,
    documentElement: { scrollHeight: 2000 },
    createElement: () => ({}),
    getElementById: (id) => elements[id],
    head: { appendChild: (script) => scripts.push(script) },
    addEventListener: listen,
  };
  const window = { innerHeight: 1000, scrollY: 0, addEventListener: listen };
  const localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  };
  const context = vm.createContext({ window, document, localStorage });
  vm.runInContext(code, context);
  vm.runInContext(code, context); // Carregamento acidental duplicado.
  assert.equal(listeners.click.length, 1);
  assert.equal(listeners.scroll.length, 1);
  return {
    window, document, scripts, storage, elements,
    events: () => window.dataLayer.filter((entry) => entry[0] === "event")
      .map((entry) => ({ event: entry[1], ...entry[2] })),
    click: (data) => {
      const event = {
        defaultPrevented: false,
        target: { closest: () => ({ dataset: data }) },
        preventDefault() { throw new Error("Tracking bloqueou navegação"); },
      };
      listeners.click[0](event);
      assert.equal(event.defaultPrevented, false);
    },
    scroll: (y) => { window.scrollY = y; listeners.scroll[0](); },
  };
}

let totalWhatsApp = 0;
let totalSocial = 0;
let totalReviews = 0;
for (const file of ["index", "blog", ...Object.keys(services)]) {
  const html = fs.readFileSync(path.join(root, `${file}.html`), "utf8");
  const page = file === "index" ? "home" : file;
  const expectedService = services[page] || "general";
  assert.equal(dataset(html.match(/<body[^>]*>/)[0]).page, page);
  assert.equal((html.match(/src="js\/analytics.js"/g) || []).length, 1);
  assert.ok(html.indexOf('src="js/analytics.js"') < html.indexOf('src="js/script.js'));
  assert.doesNotMatch(html, /trackEvent\(|trackConversion\(|gtag\(/);
  const rt = runtime(page);
  assert.equal(rt.window.dataLayer[0][0], "consent");
  assert.equal(rt.window.dataLayer[0][2].analytics_storage, "denied");
  rt.click({ track: "whatsapp" });
  rt.scroll(950);
  assert.equal(rt.events().length, 0);
  assert.equal(rt.scripts.length, 0);
  rt.window.setAnalyticsConsent("true");
  assert.equal(rt.window.pushAnalyticsEvent("whatsapp_click"), false);
  rt.window.setAnalyticsConsent(true);

  const links = [...html.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
  const locations = new Set();
  for (const tag of links) {
    const a = attrs(tag);
    const data = dataset(tag);
    if (a.target === "_blank") {
      assert.ok(a.rel?.split(/\s+/).includes("noopener"), file);
      assert.ok(a.rel?.split(/\s+/).includes("noreferrer"), file);
    }
    if (a.href.startsWith("https://wa.me/")) {
      totalWhatsApp++;
      assert.equal(new URL(a.href).pathname, "/5511987382366");
      assert.equal(data.track, "whatsapp");
      assert.equal(data.service, expectedService);
      assert.ok(data.location && !locations.has(data.location), file);
      locations.add(data.location);
    }
    if (/instagram.com|tiktok.com/.test(a.href)) {
      totalSocial++;
      assert.equal(data.track, "social");
      assert.equal(data.platform, a.href.includes("instagram") ? "instagram" : "tiktok");
    }
    if (data.track === "google_reviews") totalReviews++;
    if (a["aria-label"] === "Google Maps") assert.equal(data.track, undefined);
    if (!data.track) continue;
    assert.ok(data.location);
    const before = rt.events().length;
    rt.click(data);
    assert.equal(rt.events().length, before + 1);
    const event = rt.events().at(-1);
    assert.equal(event.event, actions[data.track]);
    assert.equal(event.page, page);
    assert.equal(event.cta_location, data.location);
    assert.equal(event.service, data.service);
    assert.equal(event.platform, data.platform);
  }
  assert.equal(locations.size, file === "index" ? 8 : file === "blog" ? 10 : 4);
  rt.scroll(499);
  rt.scroll(500);
  rt.scroll(900);
  rt.scroll(1000);
  rt.scroll(0);
  rt.scroll(1000);
  assert.deepEqual(Array.from(rt.events().filter((e) => e.event === "scroll_depth"), (e) => e.percent), [50, 90]);
  rt.window.setAnalyticsConsent(false);
  const before = rt.events().length;
  rt.click({ track: "whatsapp" });
  assert.equal(rt.events().length, before);
  assert.equal(rt.scripts.length, 1, "GA4 carrega apenas após consentimento");

  if (file === "index") {
    const cards = links.filter((tag) => attrs(tag).class === "servico-card");
    assert.equal(cards.length, 4);
    for (const card of cards) {
      const a = attrs(card);
      assert.equal(a["data-service"], services[a.href.replace(".html", "")]);
      assert.equal(a["data-track"], "service");
      assert.ok(fs.existsSync(path.join(root, a.href)));
    }
    const ids = [...html.matchAll(/data-portfolio-image data-item-id="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, 6);
    rt.window.setAnalyticsConsent(true);
    for (const item_id of ids) {
      rt.window.pushAnalyticsEvent("portfolio_view", { item_id });
      assert.equal(rt.events().at(-1).item_id, item_id);
    }
  }
}
assert.deepEqual([totalWhatsApp, totalSocial, totalReviews], [34, 17, 2]);

const broken = runtime();
broken.window.setAnalyticsConsent(true);
delete broken.window.dataLayer;
broken.click({ track: "whatsapp", location: "hero" });
assert.equal(broken.events().length, 1);
broken.window.dataLayer = { push() { throw new Error("Bloqueado"); } };
assert.doesNotThrow(() => broken.click({ track: "whatsapp" }));
assert.doesNotThrow(() => broken.window.setAnalyticsConsent(false));
assert.equal(broken.window.pushAnalyticsEvent("page_exit"), false);

// O sandbox vm não faz requisições: apenas valida fila, ID e deduplicação.
const configured = runtime();
assert.equal(configured.scripts.length, 0);
configured.window.setAnalyticsConsent(true);
configured.window.setAnalyticsConsent(true);
assert.equal(configured.scripts.length, 1);
assert.equal(configured.window.dataLayer[1][0], "consent");
assert.equal(configured.window.dataLayer[2][0], "js");
assert.deepEqual(Array.from(configured.window.dataLayer[3]), ["config", "G-EMDNPLS1H3"]);
assert.equal(configured.scripts[0].src, "https://www.googletagmanager.com/gtag/js?id=G-EMDNPLS1H3");
configured.window.setAnalyticsConsent(false);
configured.click({ track: "whatsapp" });
assert.equal(configured.events().length, 0);

const consentKey = "studio_anna_analytics_consent";
const firstVisit = runtime("home", source, true);
assert.equal(firstVisit.elements["cookie-consent"].hidden, false);
assert.equal(firstVisit.scripts.length, 0);
firstVisit.elements["cookie-consent-accept"].click();
assert.equal(JSON.parse(firstVisit.storage.get(consentKey)).granted, true);
assert.equal(firstVisit.elements["cookie-consent"].hidden, true);
assert.equal(firstVisit.scripts.length, 1);

const returningVisit = runtime("home", source, true, {
  [consentKey]: JSON.stringify({ granted: true, expires: Date.now() + 10000 }),
});
assert.equal(returningVisit.elements["cookie-consent"].hidden, true);
assert.equal(returningVisit.scripts.length, 1);

const declinedVisit = runtime("home", source, true);
declinedVisit.elements["cookie-consent-decline"].click();
assert.equal(JSON.parse(declinedVisit.storage.get(consentKey)).granted, false);
assert.equal(declinedVisit.elements["cookie-consent"].hidden, true);
assert.equal(declinedVisit.scripts.length, 0);

const expiredChoice = runtime("home", source, true, {
  [consentKey]: JSON.stringify({ granted: true, expires: Date.now() - 1 }),
});
assert.equal(expiredChoice.elements["cookie-consent"].hidden, false);
assert.equal(expiredChoice.storage.has(consentKey), false);
assert.equal(expiredChoice.scripts.length, 0);

console.log("Analytics OK: GA4 G-EMDNPLS1H3 centralizado; consentimento por 180 dias, fechamento, 6 páginas, eventos e deduplicação validados.");
