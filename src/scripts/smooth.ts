// Relaxed, eased scrolling for the whole site (mouse wheel and keyboard). Touch screens keep their native feel.
import Lenis from 'lenis';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  const lenis = new Lenis({
    duration: 1.35,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 0.9,
    anchors: { offset: -84, duration: 1.6 },
  });
  (window as any).__lenis = lenis;

  const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);

  // overlays (menu, search, photo viewer, chat list) mark inner scroll areas so the page doesn't steal their wheel
  const tag = () => document.querySelectorAll('.search-body, .chat-body, #mobile-menu aside, .lightbox').forEach((el) => el.setAttribute('data-lenis-prevent', ''));
  tag();

  // the other scripts lock the page with body overflow:hidden while an overlay is open; follow that
  const sync = () => (document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start());
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['style'] });
}
