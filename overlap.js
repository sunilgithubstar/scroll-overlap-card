gsap.registerPlugin(ScrollTrigger);

let ctx;

/* --------------------------------
   DYNAMIC HEIGHT (NO dvh / svh)
-------------------------------- */
function setDynamicHeight() {
  const sections = document.querySelectorAll(".overlap-conatiner-container");

  sections.forEach((section) => {
    section.style.minHeight = `${window.innerHeight}px`;
  });
}

/* --------------------------------
   CARD ANIMATION (UNCHANGED)
-------------------------------- */
function cardAnimation() {
  if (ctx) ctx.revert();

  // ❌ stop only for extremely small screens if needed
  if (window.innerWidth < 320) return;

  ctx = gsap.context(() => {
    const cards = gsap.utils.toArray(".card");
    const wrappers = gsap.utils.toArray(".card-wrapper");

    /* -------------------------------
       RESPONSIVE BASE OFFSET
    -------------------------------- */
    const getBaseOffset = () => {
      const w = window.innerWidth;

      if (w >= 1920) {
        return 220; // 🖥 1920px and above
      }

      if (w >= 1280) {
        return 160; // 💻 1280px – 1919px
      }

      if (w >= 1024) {
        return 150; // 📱 Tablet landscape
      }

      if (w >= 640) {
        return 140; // 📱 Mobile large
      }

      return 140; // 📱 Mobile small fallback
    };

    const getOffset = (index) => {
      const base = getBaseOffset();
      return base + index * 60;
    };

    /* -------------------------------
       INITIAL STATE
    -------------------------------- */
    cards.forEach((card, i) => {
      gsap.set(card, {
        scale: 0.87 + i * 0.02,
        transformOrigin: "center top",
        willChange: "transform",
      });
    });

    /* -------------------------------
       SCALE + PIN
    -------------------------------- */
    cards.forEach((card, i) => {
      gsap.to(card, {
        scale: 0.87 + i * 0.02,
        ease: "none",
        scrollTrigger: {
          trigger: wrappers[i],
          start: "top center",
          end: () => `top ${getOffset(i)}px`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.create({
        trigger: wrappers[i],
        start: () => `top ${getOffset(i)}px`,
        endTrigger: wrappers[wrappers.length - 1],
        end: () => `top ${getOffset(i)}px`,
        pin: wrappers[i],
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    });
  });

  ScrollTrigger.refresh();
}

/* ---------- LOAD ---------- */
window.addEventListener("load", () => {
  setDynamicHeight();
  cardAnimation();
});

/* ---------- RESIZE ---------- */
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    setDynamicHeight();
    ScrollTrigger.refresh();
    cardAnimation();
  }, 300);
});
