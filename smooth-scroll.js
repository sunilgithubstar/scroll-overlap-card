// 1️⃣ Init Lenis
const lenis = new Lenis({
  duration: 1.6,
  smooth: true,
  lerp: 0.05,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.2,
});

// 2️⃣ RAF loop
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 3️⃣ Tell ScrollTrigger to use Lenis
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    if (arguments.length) {
      lenis.scrollTo(value);
    } else {
      return lenis.scroll.instance.scroll;
    }
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
});

// 4️⃣ Sync ScrollTrigger on scroll
lenis.on("scroll", ScrollTrigger.update);

// 5️⃣ Default scroller
ScrollTrigger.defaults({
  scroller: document.body,
});

// 6️⃣ Refresh fix
ScrollTrigger.addEventListener("refresh", () => lenis.update());
ScrollTrigger.refresh();
