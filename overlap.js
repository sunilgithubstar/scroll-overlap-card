// overlap.js

gsap.registerPlugin(ScrollTrigger);

let ctx;

/* --------------------------------
   EQUAL CARD HEIGHT FUNCTION
-------------------------------- */
function equalCardHeights() {
  const cards = document.querySelectorAll(".card");

  // Reset height first
  cards.forEach((card) => {
    card.style.height = "auto";
  });

  let maxHeight = 0;

  cards.forEach((card) => {
    const height = card.offsetHeight;
    if (height > maxHeight) {
      maxHeight = height;
    }
  });

  // Apply max height to all
  cards.forEach((card) => {
    card.style.height = maxHeight + "px";
  });
}

/* --------------------------------
   CARD ANIMATION
-------------------------------- */
function cardAnimation() {
  if (ctx) ctx.revert();
  if (window.innerWidth < 320) return;

  ctx = gsap.context(() => {
    const cards = gsap.utils.toArray(".card");
    const wrappers = gsap.utils.toArray(".card-wrapper");

    const baseOffset = window.innerWidth >= 1024 ? 80 : 40;
    const getOffset = (index) => baseOffset + index * 40;

    cards.forEach((card, i) => {
      // Initial scale
      gsap.set(card, {
        scale: 0.87 + i * 0.02,
        transformOrigin: "center top",
      });

      // Scale animation
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

      // Pin wrapper
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

/* --------------------------------
   INIT
-------------------------------- */
window.addEventListener("load", () => {
  equalCardHeights(); // equal height first
  cardAnimation();
});

/* --------------------------------
   RESIZE
-------------------------------- */
let resizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    equalCardHeights(); // re-calc height
    cardAnimation(); // re-init animation
  }, 300);
});
