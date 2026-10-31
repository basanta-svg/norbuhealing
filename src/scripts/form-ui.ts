// Brand-styled dropdowns, calendar and time picker. The original <select> / <input> stay in the form (hidden), so
// validation, prefill and submission keep working; this script only draws a nicer control on top of them.
import chevron from '../icons/norbu-chevron-down.svg?raw';
import calendarIcon from '../icons/norbu-booking.svg?raw';
import clockIcon from '../icons/norbu-hours.svg?raw';
import arrow from '../icons/norbu-arrow-right.svg?raw';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (v: string) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
const fmtDate = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
const fmtTime = (v: string) => { const [h, m] = v.split(':').map(Number); return `${h % 12 || 12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`; };
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const svg = (raw: string, cls = '') => raw.replace('<svg ', `<svg class="${cls}" aria-hidden="true" focusable="false" `);

let openPop: { close: () => void } | null = null;
const closeAll = () => { openPop?.close(); openPop = null; };

/** Shared shell: a trigger button that looks like the other fields, plus a popover under it. */
function build(native: HTMLInputElement | HTMLSelectElement, iconSvg: string, placeholder: string) {
  const wrap = document.createElement('div');
  wrap.className = 'fu';
  native.parentNode!.insertBefore(wrap, native);
  wrap.appendChild(native);
  native.classList.add('fu-native');
  native.tabIndex = -1;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'field-input fu-trigger';
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');
  const label = document.querySelector<HTMLLabelElement>(`label[for="${native.id}"]`);
  if (label) { label.removeAttribute('for'); label.id ||= `${native.id}-label`; trigger.setAttribute('aria-labelledby', label.id); label.addEventListener('click', () => trigger.focus()); }
  trigger.innerHTML = `<span class="fu-value" data-placeholder="true">${esc(placeholder)}</span>${iconSvg}`;
  wrap.insertBefore(trigger, native);

  const pop = document.createElement('div');
  pop.className = 'fu-pop';
  pop.setAttribute('data-lenis-prevent', ''); // the smooth-scroll script must leave the wheel to this scrollable list
  pop.hidden = true;
  wrap.appendChild(pop);

  const valueEl = trigger.querySelector<HTMLElement>('.fu-value')!;
  const setText = (text: string | null) => { valueEl.textContent = text ?? placeholder; valueEl.toggleAttribute('data-placeholder', !text); };

  const place = () => {
    pop.classList.remove('fu-up', 'fu-right');
    let r = pop.getBoundingClientRect();
    // keep the popover inside the form: align it to the right edge of the field when it would spill out
    const limit = Math.min((wrap.closest('form') ?? document.body).getBoundingClientRect().right, innerWidth - 8);
    if (r.right > limit) { pop.classList.add('fu-right'); r = pop.getBoundingClientRect(); }
    if (r.bottom > innerHeight - 12 && trigger.getBoundingClientRect().top > r.height + 24) pop.classList.add('fu-up');
  };
  const close = () => {
    if (pop.hidden) return;
    pop.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    if (!pop.hidden) return;
    closeAll();
    pop.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    openPop = { close };
    place();
  };
  trigger.addEventListener('click', () => (pop.hidden ? open() : close()));

  // the form's validation marks the hidden control invalid / focuses it: mirror that on the visible one
  new MutationObserver(() => trigger.setAttribute('aria-invalid', native.getAttribute('aria-invalid') ?? 'false')).observe(native, { attributes: true, attributeFilter: ['aria-invalid'] });
  native.addEventListener('focus', () => trigger.focus());
  native.form?.addEventListener('reset', () => setTimeout(() => native.dispatchEvent(new Event('fu:sync')), 0));
  wrap.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) { e.stopPropagation(); close(); trigger.focus(); } });

  const commit = () => { native.dispatchEvent(new Event('input', { bubbles: true })); native.dispatchEvent(new Event('change', { bubbles: true })); };
  return { wrap, trigger, pop, setText, open, close, commit, place };
}

/* ---------------------------------------------------------------- dropdown */
function enhanceSelect(sel: HTMLSelectElement) {
  const opts = [...sel.options].map((o) => ({ value: o.value || o.text, text: o.text, placeholder: o.value === '' }));
  const ui = build(sel, svg(chevron, 'fu-icon fu-chevron'), opts.find((o) => o.placeholder)?.text ?? 'Select');
  ui.pop.classList.add('fu-list');
  ui.pop.setAttribute('role', 'listbox');
  ui.pop.tabIndex = -1;

  const sync = () => {
    const cur = sel.selectedOptions[0];
    ui.setText(cur && cur.value !== '' ? cur.text : null);
    ui.pop.querySelectorAll<HTMLElement>('[role="option"]').forEach((el, i) => el.setAttribute('aria-selected', String(sel.selectedIndex === i)));
  };
  ui.pop.innerHTML = opts.map((o, i) => o.placeholder ? '' : `<button type="button" role="option" data-i="${i}" class="fu-opt"><span>${esc(o.text)}</span><i class="fu-dot" aria-hidden="true"></i></button>`).join('');
  const items = () => [...ui.pop.querySelectorAll<HTMLButtonElement>('.fu-opt')];

  ui.pop.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('.fu-opt');
    if (!b) return;
    sel.selectedIndex = Number(b.dataset.i);
    sync(); ui.commit(); ui.close(); ui.trigger.focus();
  });
  ui.trigger.addEventListener('click', () => { if (!ui.pop.hidden) (items().find((b) => b.getAttribute('aria-selected') === 'true') ?? items()[0])?.focus(); });
  ui.trigger.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); ui.open(); (items().find((b) => b.getAttribute('aria-selected') === 'true') ?? items()[0])?.focus(); } });
  ui.pop.addEventListener('keydown', (e) => {
    const list = items(); const i = list.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); list[Math.min(i + 1, list.length - 1)]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); list[Math.max(i - 1, 0)]?.focus(); }
    else if (e.key === 'Home') { e.preventDefault(); list[0]?.focus(); }
    else if (e.key === 'End') { e.preventDefault(); list[list.length - 1]?.focus(); }
  });
  sel.addEventListener('fu:sync', sync);
  sel.addEventListener('change', sync);
  sync();
  return sync;
}

/* ---------------------------------------------------------------- calendar */
function enhanceDate(input: HTMLInputElement, all: HTMLInputElement[]) {
  const ui = build(input, svg(calendarIcon, 'fu-icon'), 'Choose a date');
  ui.pop.classList.add('fu-cal');
  ui.pop.setAttribute('role', 'dialog');
  ui.pop.setAttribute('aria-label', 'Choose a date');

  const today = new Date(); today.setHours(0, 0, 0, 0);
  // a stay is at least one night: check-out starts the day after check-in (or after today, until check-in is chosen)
  const minDate = () => {
    if (input.name !== 'check_out') return today;
    const ci = all.find((i) => i.name === 'check_in' && i.form === input.form)?.value;
    const d = ci ? parse(ci) : null;
    return new Date(((d && d >= today) ? d : today).getTime() + 864e5);
  };
  let view = new Date(today.getFullYear(), today.getMonth(), 1);

  const sync = () => { const d = parse(input.value); ui.setText(d ? fmtDate(d) : null); };

  const render = (focusDay?: string) => {
    const sel = parse(input.value); const min = minDate();
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const lead = (first.getDay() + 6) % 7;
    const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const canPrev = new Date(view.getFullYear(), view.getMonth(), 0) >= min;
    let cells = '';
    for (let i = 0; i < lead; i++) cells += '<span></span>';
    for (let d = 1; d <= count; d++) {
      const date = new Date(view.getFullYear(), view.getMonth(), d);
      const off = date < min; const isSel = !!sel && +date === +sel; const isToday = +date === +today;
      cells += `<button type="button" class="fu-day${isSel ? ' is-sel' : ''}${isToday ? ' is-today' : ''}" data-date="${iso(date)}" ${off ? 'disabled' : ''} ${isSel ? 'aria-pressed="true"' : ''} aria-label="${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}">${d}</button>`;
    }
    ui.pop.innerHTML = `
      <div class="fu-cal-head">
        <button type="button" class="fu-nav" data-nav="-1" aria-label="Previous month" ${canPrev ? '' : 'disabled'}>${svg(arrow, 'fu-flip')}</button>
        <p class="fu-month" aria-live="polite">${MONTHS[view.getMonth()]} ${view.getFullYear()}</p>
        <button type="button" class="fu-nav" data-nav="1" aria-label="Next month">${svg(arrow)}</button>
      </div>
      <div class="fu-week">${DAYS.map((d) => `<span>${d}</span>`).join('')}</div>
      <div class="fu-grid">${cells}</div>
      <div class="fu-foot"><button type="button" data-today ${today < min ? 'disabled' : ''}>Today</button><button type="button" data-clear>Clear</button></div>`;
    if (focusDay) ui.pop.querySelector<HTMLButtonElement>(`[data-date="${focusDay}"]:not([disabled])`)?.focus();
  };

  const pick = (d: Date) => { input.value = iso(d); sync(); ui.commit(); ui.close(); ui.trigger.focus(); // moving check-in can invalidate check-out
    if (input.name === 'check_in') { const out = all.find((i) => i.name === 'check_out' && i.form === input.form); const od = out ? parse(out.value) : null; if (out && od && od <= d) { out.value = ''; out.dispatchEvent(new Event('fu:sync')); } } };

  ui.pop.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const day = t.closest<HTMLButtonElement>('.fu-day');
    const nav = t.closest<HTMLButtonElement>('[data-nav]');
    if (day && !day.disabled) return pick(parse(day.dataset.date!)!);
    if (nav && !nav.disabled) { view = new Date(view.getFullYear(), view.getMonth() + Number(nav.dataset.nav), 1); render(); ui.pop.querySelector<HTMLButtonElement>(`[data-nav="${nav.dataset.nav}"]:not([disabled])`)?.focus(); }
    if (t.closest('[data-today]')) { const b = t.closest<HTMLButtonElement>('[data-today]')!; if (!b.disabled) pick(today); }
    if (t.closest('[data-clear]')) { input.value = ''; sync(); ui.commit(); render(); }
  });
  ui.pop.addEventListener('keydown', (e) => {
    const cur = (document.activeElement as HTMLElement)?.closest<HTMLButtonElement>('.fu-day');
    if (!cur) return;
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key as 'ArrowLeft'];
    if (!step) return;
    e.preventDefault();
    const d = parse(cur.dataset.date!)!; d.setDate(d.getDate() + step);
    if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) { if (d < minDate()) return; view = new Date(d.getFullYear(), d.getMonth(), 1); render(iso(d)); }
    else ui.pop.querySelector<HTMLButtonElement>(`[data-date="${iso(d)}"]:not([disabled])`)?.focus();
  });
  ui.trigger.addEventListener('click', () => {
    if (ui.pop.hidden) return;
    const d = parse(input.value); const min = minDate();
    view = d ? new Date(d.getFullYear(), d.getMonth(), 1) : new Date(min.getFullYear(), min.getMonth(), 1);
    render(); ui.place();
    (ui.pop.querySelector<HTMLButtonElement>('.fu-day.is-sel') ?? ui.pop.querySelector<HTMLButtonElement>('.fu-day:not([disabled])'))?.focus({ preventScroll: true });
  });
  input.addEventListener('fu:sync', sync);
  sync();
}

/* ------------------------------------------------------------------- time */
function enhanceTime(input: HTMLInputElement) {
  const ui = build(input, svg(clockIcon, 'fu-icon'), 'Choose a time');
  ui.pop.classList.add('fu-time');
  ui.pop.setAttribute('role', 'listbox');
  // opening hours are 10:00 AM to 8:00 PM, in half-hour steps
  const slots: string[] = [];
  for (let m = 10 * 60; m <= 20 * 60; m += 30) slots.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  const groups: [string, string[]][] = [['Morning', slots.filter((s) => +s.slice(0, 2) < 12)], ['Afternoon', slots.filter((s) => +s.slice(0, 2) >= 12 && +s.slice(0, 2) < 17)], ['Evening', slots.filter((s) => +s.slice(0, 2) >= 17)]];
  ui.pop.innerHTML = groups.map(([name, list]) => `<p class="fu-time-label">${name}</p><div class="fu-time-grid">${list.map((s) => `<button type="button" role="option" class="fu-slot" data-time="${s}">${fmtTime(s)}</button>`).join('')}</div>`).join('');
  const sync = () => {
    ui.setText(input.value ? fmtTime(input.value) : null);
    ui.pop.querySelectorAll<HTMLElement>('.fu-slot').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.time === input.value)));
  };
  ui.pop.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('.fu-slot');
    if (!b) return;
    input.value = b.dataset.time!; sync(); ui.commit(); ui.close(); ui.trigger.focus();
  });
  ui.trigger.addEventListener('click', () => { if (!ui.pop.hidden) { ui.place(); (ui.pop.querySelector<HTMLButtonElement>('.fu-slot[aria-selected="true"]') ?? ui.pop.querySelector<HTMLButtonElement>('.fu-slot'))?.focus({ preventScroll: true }); } });
  ui.pop.addEventListener('keydown', (e) => {
    const list = [...ui.pop.querySelectorAll<HTMLButtonElement>('.fu-slot')]; const i = list.indexOf(document.activeElement as HTMLButtonElement);
    const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3 }[e.key as 'ArrowLeft'];
    if (d && i >= 0) { e.preventDefault(); list[Math.max(0, Math.min(list.length - 1, i + d))].focus(); }
  });
  input.addEventListener('fu:sync', sync);
  sync();
}

/* ------------------------------------------------------------------ boot */
const dates = [...document.querySelectorAll<HTMLInputElement>('form[data-form] input[type="date"]')];
const syncs: (() => void)[] = [];
document.querySelectorAll<HTMLSelectElement>('form[data-form] select, .field select.field-input').forEach((s) => { if (!s.closest('.fu')) syncs.push(enhanceSelect(s)); });
dates.forEach((d) => enhanceDate(d, dates));
document.querySelectorAll<HTMLInputElement>('form[data-form] input[type="time"]').forEach(enhanceTime);

// other scripts prefill selects from the address (?service=…) after this runs, so look again once everything has loaded
addEventListener('load', () => syncs.forEach((f) => f()));
// composedPath is read from the moment of the click, so it still works after the calendar re-draws itself (which detaches the clicked button)
document.addEventListener('click', (e) => { if (openPop && !e.composedPath().some((n) => (n as HTMLElement).classList?.contains('fu'))) closeAll(); });
