const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- reveal on scroll ---- */
const revealEls = document.querySelectorAll<HTMLElement>('.reveal');
if ('IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );
  revealEls.forEach((el) => io.observe(el));
} else revealEls.forEach((el) => el.classList.add('is-in'));

/* ---- sticky header + back to top + parallax ---- */
const header = document.getElementById('site-header');
const toTop = document.getElementById('back-to-top');
const parallax = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
const canParallax = !reduce && matchMedia('(min-width: 1024px)').matches;
let ticking = false;
const onScroll = () => {
  const y = window.scrollY;
  header?.setAttribute('data-scrolled', String(y > 100));
  toTop?.setAttribute('data-show', String(y > 600));
  if (canParallax) parallax.forEach((el) => { el.style.transform = `translateY(${y * Number(el.dataset.parallax) * -1}px)`; });
  ticking = false;
};
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();
toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

/* ---- mobile menu ---- */
const menu = document.getElementById('mobile-menu');
const openBtn = document.getElementById('menu-open');
const setMenu = (open: boolean) => {
  menu?.classList.toggle('open', open);
  menu?.setAttribute('aria-hidden', String(!open));
  openBtn?.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) menu?.querySelector<HTMLElement>('[data-menu-close]')?.focus(); else if (!open) openBtn?.focus({ preventScroll: true });
};
openBtn?.addEventListener('click', () => setMenu(true));
document.querySelectorAll('[data-menu-open]').forEach((el) => el.addEventListener('click', () => setMenu(true)));
menu?.querySelectorAll('[data-menu-close],[data-menu-backdrop]').forEach((el) => el.addEventListener('click', () => setMenu(false)));
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu?.classList.contains('open')) setMenu(false); });

/* ---- counters ---- */
const counters = document.querySelectorAll<HTMLElement>('[data-count]');
const runCounter = (el: HTMLElement) => {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix ?? '';
  if (reduce) { el.textContent = target + suffix; return; }
  const t0 = performance.now(), dur = 1800;
  const tick = (t: number) => {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
if ('IntersectionObserver' in window) {
  const cio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { runCounter(e.target as HTMLElement); cio.unobserve(e.target); } }), { threshold: 0.4 });
  counters.forEach((c) => cio.observe(c));
} else counters.forEach(runCounter);

/* ---- forms ---- */
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
  const msg = form.querySelector<HTMLElement>('[data-form-msg]');
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    let ok = true;
    form.querySelectorAll<HTMLInputElement>('input,select,textarea').forEach((f) => {
      const err = f.closest('.field')?.querySelector<HTMLElement>('.field-error');
      let m = '';
      if (f.required && !f.value.trim()) m = 'This field is required.';
      else if (f.type === 'email' && f.value && !emailRe.test(f.value)) m = 'Please enter a valid email address.';
      else if (f.type === 'tel' && f.value && !/^[+\d][\d\s()-]{6,}$/.test(f.value)) m = 'Please enter a valid phone number.';
      f.setAttribute('aria-invalid', String(!!m));
      if (err) err.textContent = m;
      if (m) ok = false;
    });
    if (!ok) { form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(); if (msg) msg.textContent = 'Please fix the highlighted fields.'; return; }
    const endpoint = form.dataset.endpoint;
    try {
      if (endpoint) {
        const r = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
        if (!r.ok) throw new Error('bad response');
      } else await new Promise((r) => setTimeout(r, 400)); // no endpoint configured: demo success
      form.reset();
      if (msg) msg.textContent = form.dataset.kind === 'newsletter' ? 'Thank you for subscribing.' : 'Thank you! We have received your enquiry. Our team will contact you to confirm the details.';
    } catch {
      if (msg) msg.textContent = 'Sorry, something went wrong. Please try again or contact us directly.';
    }
  });
});
