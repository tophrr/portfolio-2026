/* 
  Christopher G. - Portfolio 2026
*/

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* Current year */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Nav sticky background on scroll */
  const nav = $("#nav");
  const onScroll = () =>
    nav && nav.classList.toggle("is-stuck", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Marquee: duplicate group so the loop is seamless */
  $$("[data-marquee]").forEach((marquee) => {
    const track = $(".marquee__track", marquee);
    const group = $(".marquee__group", marquee);
    if (!track || !group) return;
    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  /* Scroll reveals */
  const revealables = $$(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    revealables.forEach((el) => io.observe(el));
  }

  /* Active nav link based on visible section */
  const navLinks = $$("[data-nav]");
  const sections = navLinks
    .map((link) => $(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach((link) =>
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === id,
            ),
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* Hero status, typewriter rotator */
  const rotator = $("[data-rotator]");
  if (rotator) {
    const out = $(".rotator__text", rotator);
    const lines = (rotator.dataset.lines || "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);

    if (out && lines.length) {
      if (reduceMotion || lines.length === 1) {
        out.textContent = lines[0];
      } else {
        let lineIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const tick = () => {
          const line = lines[lineIndex];

          if (!deleting) {
            charIndex++;
            out.textContent = line.slice(0, charIndex);
            if (charIndex === line.length) {
              deleting = true;
              return setTimeout(tick, 1600);
            }
            return setTimeout(tick, 46);
          }

          charIndex--;
          out.textContent = line.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            lineIndex = (lineIndex + 1) % lines.length;
            return setTimeout(tick, 420);
          }
          return setTimeout(tick, 26);
        };

        setTimeout(tick, 600);
      }
    }
  }

  /* Fixed background, hold then fade into the biography */
  const bg = $("#bg");
  const bio = $("#about");
  if (bg && bio) {
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const top = bio.getBoundingClientRect().top; // vh to 0 as the bio enters
      const start = vh * 0.6; // begin fading at 60% of the viewport
      const end = 0; // fully faded at the top
      let p = (start - top) / (start - end);
      p = Math.min(1, Math.max(0, p));
      const eased = p * p * (3 - 2 * p); // smoothstep
      bg.style.opacity = (1 - eased).toFixed(3);
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    update();
  }

  /* Hero video, fade in once it can play */
  const video = $("#heroVideo");
  if (video) {
    const ready = () => video.classList.add("is-ready");
    if (video.readyState >= 2) ready();
    else video.addEventListener("loadeddata", ready, { once: true });
    // Autoplay can be blocked. nudge it, then reveal anyway.
    const attempt = video.play?.();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => setTimeout(ready, 600));
    }
    setTimeout(ready, 2500);
  }
})();
