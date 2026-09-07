const revealSections = [...document.querySelectorAll("[data-reveal]")];

if (
  matchMedia(
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  ).matches
) {
  const root = document.documentElement;
  document.addEventListener(
    "pointermove",
    ({ clientX, clientY }) => {
      root.style.setProperty("--mouse-x", `${clientX}px`);
      root.style.setProperty("--mouse-y", `${clientY}px`);
      document.body.classList.add("mouse-gradient-active");
    },
    { passive: true },
  );
  root.addEventListener("mouseleave", () =>
    document.body.classList.remove("mouse-gradient-active"),
  );
}

if (
  revealSections.length &&
  "IntersectionObserver" in window &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -10%" },
  );

  revealSections.forEach((section) => revealObserver.observe(section));
  document.documentElement.classList.add("reveal-enabled");
}

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const menuLinks = [...document.querySelectorAll(".mobile-menu a")];
const setActiveLink = (activeLink) => {
  menuLinks.forEach((link) => {
    const active = link === activeLink;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
};

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!link.getAttribute("href")?.startsWith("#")) return;
    setActiveLink(link);
  });
});

const initialHashLink = menuLinks.find(
  (link) => link.getAttribute("href") === location.hash,
);
if (initialHashLink) setActiveLink(initialHashLink);

if (menuToggle && navLinks) {
  const setMenu = (open) => {
    menuToggle.classList.toggle("active", open);
    navLinks.classList.toggle("show", open);
    document.body.classList.toggle("nav-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };

  menuToggle.addEventListener("click", () =>
    setMenu(!navLinks.classList.contains("show")),
  );
  menuToggle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setMenu(!navLinks.classList.contains("show"));
    }
  });
  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("click", (event) => {
    if (!menuToggle.contains(event.target) && !navLinks.contains(event.target))
      setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("show")) {
      setMenu(false);
      menuToggle.focus();
    }
  });
}

const header = document.querySelector("[data-header], .site-header, .site-nav");
const backToTop = document.querySelector(".back-to-top");
const updateScrollState = () => {
  header?.classList.toggle("scrolled", window.scrollY > 24);
  backToTop?.classList.toggle("show", window.scrollY > 600);
};

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });
backToTop?.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () =>
    navigator.serviceWorker.register("/sw.js").catch(() => {}),
  );
}

const portfolioDialog = document.querySelector("#portfolio-lightbox");
if (portfolioDialog) {
  const dialogImage = portfolioDialog.querySelector("img");
  const dialogCaption = portfolioDialog.querySelector("p");

  document.querySelectorAll("[data-portfolio-image]").forEach((button) => {
    button.addEventListener("click", () => {
      dialogImage.src = button.dataset.full;
      dialogImage.alt = button.dataset.title;
      dialogCaption.textContent = button.dataset.title;
      portfolioDialog.showModal();
      window.pushAnalyticsEvent?.("portfolio_view", {
        item_id: button.dataset.itemId,
      });
    });
  });

  portfolioDialog
    .querySelector("[data-dialog-close]")
    .addEventListener("click", () => portfolioDialog.close());
  portfolioDialog.addEventListener("click", (event) => {
    if (event.target === portfolioDialog) portfolioDialog.close();
  });
}

const studioGallery = document.querySelector("[data-studio-gallery]");
if (studioGallery) {
  const cards = [...studioGallery.querySelectorAll("[data-studio-card]")];
  const dots = [...studioGallery.querySelectorAll("[data-studio-dot]")];
  const status = studioGallery.querySelector("[data-studio-status]");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const captions = cards.map(
    (card) => card.querySelector("span")?.textContent.trim() || "",
  );
  let current = 0;
  let startX = 0;
  let dragged = false;
  let locked = false;
  let autoTimer;
  let resumeTimer;

  const renderStudioGallery = () => {
    cards.forEach((card, index) => {
      const offset = (index - current + cards.length) % cards.length;

      card.classList.remove("is-active", "is-next", "is-back", "is-deep");
      card.tabIndex = index === current ? 0 : -1;
      card.setAttribute("aria-hidden", String(index !== current));

      if (offset === 0) card.classList.add("is-active");
      else if (offset === 1) card.classList.add("is-next");
      else if (offset === 2) card.classList.add("is-back");
      else card.classList.add("is-deep");
    });

    dots.forEach((dot, index) => {
      if (index === Math.floor(current / 2))
        dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });

    if (status)
      status.textContent = `Foto ${current + 1} de ${cards.length}: ${captions[current]}`;
  };

  const showStudioPhoto = (next, step) => {
    if (locked || cards.length < 2 || next === current) return;
    locked = true;
    const outgoing = cards[current];
    outgoing.classList.add(step > 0 ? "is-exiting-next" : "is-exiting-prev");

    setTimeout(
      () => {
        outgoing.classList.remove("is-exiting-next", "is-exiting-prev");
        current = next;
        renderStudioGallery();
        locked = false;
      },
      reduceMotion.matches ? 0 : 420,
    );
  };
  const moveStudioGallery = (step) => {
    showStudioPhoto((current + step + cards.length) % cards.length, step);
  };

  const pauseStudioAuto = () => {
    clearInterval(autoTimer);
    clearTimeout(resumeTimer);
  };
  const startStudioAuto = () => {
    if (!reduceMotion.matches)
      autoTimer = setInterval(() => moveStudioGallery(1), 5600);
  };
  const resumeStudioAuto = () => {
    if (!reduceMotion.matches) resumeTimer = setTimeout(startStudioAuto, 5000);
  };
  const userMoveStudioGallery = (step) => {
    pauseStudioAuto();
    moveStudioGallery(step);
    resumeStudioAuto();
  };

  studioGallery
    .querySelector("[data-studio-next]")
    ?.addEventListener("click", () => userMoveStudioGallery(1));
  studioGallery
    .querySelector("[data-studio-prev]")
    ?.addEventListener("click", () => userMoveStudioGallery(-1));
  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (dragged) {
        event.preventDefault();
        dragged = false;
        return;
      }
      userMoveStudioGallery(1);
    });
  });
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      pauseStudioAuto();
      showStudioPhoto(index * 2, index * 2 > current ? 1 : -1);
      resumeStudioAuto();
    });
  });

  studioGallery.addEventListener("pointerdown", (event) => {
    pauseStudioAuto();
    startX = event.clientX;
    dragged = false;
  });
  studioGallery.addEventListener("pointermove", (event) => {
    if (startX && Math.abs(event.clientX - startX) > 12) dragged = true;
  });
  studioGallery.addEventListener("pointerup", (event) => {
    const diff = event.clientX - startX;
    startX = 0;
    if (Math.abs(diff) > 44) userMoveStudioGallery(diff < 0 ? 1 : -1);
    else resumeStudioAuto();
  });
  studioGallery.addEventListener("pointercancel", () => {
    startX = 0;
    resumeStudioAuto();
  });
  studioGallery.addEventListener("mouseenter", pauseStudioAuto);
  studioGallery.addEventListener("mouseleave", resumeStudioAuto);
  studioGallery.addEventListener("focusin", pauseStudioAuto);
  studioGallery.addEventListener("focusout", resumeStudioAuto);
  studioGallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      userMoveStudioGallery(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      userMoveStudioGallery(-1);
    }
  });

  renderStudioGallery();
  startStudioAuto();
}
