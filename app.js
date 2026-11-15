(() => {
  "use strict";

  const WHATSAPP_URL = "https://wa.me/551299646738";
  // Add the official Facebook page URL here when it is available.
  const FACEBOOK_URL = "";

  const hero = document.querySelector(".hero");
  const video = document.querySelector(".hero__video");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);

  const revealHero = () => {
    if (hero) hero.dataset.revealed = "true";
  };

  const useHeroFallback = () => {
    if (!hero) return;
    hero.dataset.videoFallback = "true";
    if (video) video.pause();
    revealHero();
  };

  if (hero && video) {
    if (reducedMotion.matches || saveData) {
      hero.dataset.static = "true";
      video.pause();
      video.removeAttribute("autoplay");
      video.preload = "none";
      revealHero();
    } else {
      let introFinished = false;
      let started = false;

      const finishIntro = () => {
        if (introFinished) return;
        introFinished = true;
        video.loop = true;
        revealHero();
        video.play().catch(useHeroFallback);
      };

      video.addEventListener("playing", () => {
        started = true;
        hero.classList.add("is-playing");
      }, { once: true });
      video.addEventListener("ended", finishIntro, { once: true });
      video.addEventListener("error", useHeroFallback, { once: true });

      // If autoplay is blocked or the media stalls before its first frame,
      // show the prepared poster and keep the rest of the page usable.
      const playbackTimeout = window.setTimeout(() => {
        if (!started || video.paused) useHeroFallback();
      }, 12000);
      video.addEventListener("playing", () => window.clearTimeout(playbackTimeout), { once: true });

      video.play().catch(useHeroFallback);
    }
  } else {
    revealHero();
  }

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");

  const closeMenu = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    nav.classList.remove("is-open");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
      nav.classList.toggle("is-open", !isOpen);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".nav-inner")) closeMenu();
    });
  }

  document.querySelectorAll(".js-whatsapp[data-message]").forEach((link) => {
    const message = link.dataset.message;
    if (!message) return;
    link.href = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
  });

  if (FACEBOOK_URL) {
    document.querySelectorAll(".social-link--pending").forEach((placeholder) => {
      const link = document.createElement("a");
      link.className = placeholder.className.replace("social-link--pending", "");
      link.href = FACEBOOK_URL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", "Facebook da Merenciano Calhas");
      link.innerHTML = placeholder.innerHTML;
      placeholder.replaceWith(link);
    });
  }

  const header = document.querySelector(".site-header");
  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

    observer.observe(element);
  });

  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
