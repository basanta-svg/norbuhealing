// Header search: opens as an overlay on the current page, searches a prebuilt index in the browser.
type Item = { t: string; a: string; x: string; h: string; i: string; k?: string };
type Prepared = Item & { nt: string[]; nk: string[]; na: string[]; nx: string[]; group: string };

const dialog = document.getElementById('search-dialog') as HTMLDialogElement | null;
if (dialog) init(dialog);

function init(dialog: HTMLDialogElement) {
  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const input = $<HTMLInputElement>('search-input');
  const results = $('search-results');
  const home = $('search-home');
  const empty = $('search-empty');
  const count = $('search-count');
  const filters = $('search-filters');
  const recentWrap = $('search-recent');
  const recentList = $('search-recent-list');

  let items: Prepared[] = [];
  let icons: Record<string, string> = {};
  let loading: Promise<void> | null = null;
  let group = 'All';
  let active = -1;
  let shown: Prepared[] = [];

  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, ' ');
  const words = (s: string) => norm(s).split(/\s+/).filter(Boolean);
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
  const groupOf = (a: string) =>
    a.startsWith('Healing') ? 'Healing' : a.startsWith('Salon') ? 'Salon' : a.startsWith('Hotel') ? 'Hotel' : a === 'Dining' ? 'Dining' : a.startsWith('Institute') ? 'Courses' : a === 'Department' ? 'Pages' : a.startsWith('Offer') || a === 'Page' ? 'Pages' : 'Pages';

  function load() {
    loading ??= fetch(`${import.meta.env.BASE_URL}search-index.json`)
      .then((r) => r.json())
      .then((d: { items: Item[]; icons: Record<string, string> }) => {
        icons = d.icons;
        items = d.items.map((i) => ({ ...i, nt: words(i.t), nk: words(i.k ?? ''), na: words(i.a), nx: words(i.x), group: groupOf(i.a) }));
      })
      .catch(() => { loading = null; });
    return loading!;
  }

  // edit distance, bailing out once it exceeds the allowed typo budget
  function within(a: string, b: string, max: number) {
    if (Math.abs(a.length - b.length) > max) return false;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      let min = i;
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < min) min = cur[j];
      }
      if (min > max) return false;
      prev = cur;
    }
    return prev[b.length] <= max;
  }

  // how well one query word matches a field's words: exact > prefix > inside a word > small typo
  function wordScore(q: string, fieldWords: string[]) {
    let best = 0;
    for (const w of fieldWords) {
      if (w === q) return 1;
      if (w.startsWith(q)) best = Math.max(best, 0.85);
      else if (q.length >= 3 && w.includes(q)) best = Math.max(best, 0.5);
      else if (q.length >= 4 && within(q, w.slice(0, q.length + 1), q.length >= 7 ? 2 : 1)) best = Math.max(best, 0.4);
    }
    return best;
  }

  function search(query: string): Prepared[] {
    const qs = words(query);
    if (!qs.length) return [];
    const phrase = qs.join(' ');
    const scored = items
      .filter((it) => group === 'All' || it.group === group)
      .map((it) => {
        let total = 0, matched = 0;
        for (const q of qs) {
          const s = Math.max(wordScore(q, it.nt) * 6, wordScore(q, it.nk) * 3.5, wordScore(q, it.na) * 2.5, wordScore(q, it.nx) * 1);
          if (s > 0) { matched++; total += s; }
        }
        if (matched < qs.length) return { it, score: 0 };
        const title = it.nt.join(' ');
        if (title === phrase) total += 8;
        else if (title.startsWith(phrase)) total += 4;
        else if (title.includes(phrase)) total += 2;
        return { it, score: total };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || a.it.t.length - b.it.t.length);
    return scored.slice(0, 8).map((r) => r.it);
  }

  const mark = (text: string, qs: string[]) => {
    if (!qs.length) return esc(text);
    const re = new RegExp(`(${qs.filter((q) => q.length > 1).map((q) => q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig');
    return qs.some((q) => q.length > 1) ? esc(text).replace(re, '<mark>$1</mark>') : esc(text);
  };
  const snippet = (text: string, qs: string[]) => {
    const low = text.toLowerCase();
    const at = qs.map((q) => low.indexOf(q)).filter((n) => n >= 0).sort((a, b) => a - b)[0] ?? 0;
    const start = Math.max(0, at - 30);
    const cut = text.slice(start, start + 120);
    return (start > 0 ? '…' : '') + cut + (start + 120 < text.length ? '…' : '');
  };

  function row(it: Prepared, i: number, qs: string[]) {
    return `<li role="presentation" style="--i:${i}"><a href="${it.h}" role="option" id="hit-${i}" data-i="${i}" aria-selected="${i === active}" class="search-hit">
      <span class="icon-circle" aria-hidden="true">${icons[it.i] ?? ''}</span>
      <span class="min-w-0"><span class="a">${esc(it.a)}</span><span class="t">${mark(it.t, qs)}</span><span class="x">${mark(snippet(it.x, qs), qs)}</span></span>
      <span class="go" aria-hidden="true">${icons['arrow-right'] ?? ''}</span></a></li>`;
  }

  function render() {
    const query = input.value.trim();
    const qs = words(query);
    filters.hidden = !query;
    home.hidden = !!query;
    empty.hidden = true;
    if (!items.length) { results.innerHTML = ''; count.textContent = query ? 'Searching…' : ''; return; }

    shown = query ? search(query) : items.filter((i) => ['Department', 'Page'].includes(i.a)).slice(0, 6);
    active = shown.length && query ? 0 : -1;
    results.innerHTML = shown.map((it, i) => row(it, i, qs)).join('');
    if (query && !shown.length) {
      empty.hidden = false;
      empty.querySelector('[data-query]')!.textContent = query;
    }
    count.textContent = query ? `${shown.length} result${shown.length === 1 ? '' : 's'}` : 'Popular pages and services';
    setActive(active);
  }

  function setActive(i: number) {
    active = i;
    results.querySelectorAll<HTMLElement>('.search-hit').forEach((el, n) => el.setAttribute('aria-selected', String(n === i)));
    if (i >= 0) {
      input.setAttribute('aria-activedescendant', `hit-${i}`);
      results.querySelector<HTMLElement>(`#hit-${i}`)?.scrollIntoView({ block: 'nearest' });
    } else input.removeAttribute('aria-activedescendant');
  }

  const recent = () => { try { return JSON.parse(localStorage.getItem('norbu-recent') ?? '[]') as string[]; } catch { return []; } };
  function remember(q: string) {
    const v = q.trim();
    if (v.length < 2) return;
    try { localStorage.setItem('norbu-recent', JSON.stringify([v, ...recent().filter((r) => r.toLowerCase() !== v.toLowerCase())].slice(0, 4))); } catch { /* storage unavailable */ }
  }
  function showRecent() {
    const r = recent();
    recentWrap.hidden = !r.length;
    recentList.innerHTML = r.map((q) => `<button type="button" class="search-chip" data-chip="${esc(q)}">${esc(q)}</button>`).join('');
  }

  // closing eases out before the dialog is really closed
  let closing = false;
  const closeSearch = () => {
    if (!dialog.open || closing) return;
    closing = true;
    dialog.classList.add('is-closing');
    setTimeout(() => { dialog.close(); dialog.classList.remove('is-closing'); closing = false; }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 320);
  };

  const go = (href: string) => {
    remember(input.value);
    closeSearch();
    if (href.startsWith('#') || new URL(href, location.href).pathname === location.pathname) {
      location.hash = new URL(href, location.href).hash;
    } else location.href = href;
  };

  async function open(prefill = '') {
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    input.value = prefill;
    group = 'All';
    filters.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.group === 'All')));
    showRecent();
    results.classList.add('is-entering');
    setTimeout(() => results.classList.remove('is-entering'), 900);
    render();
    input.focus();
    await load();
    render();
  }

  // ---- events ----
  document.querySelectorAll('[data-search-open]').forEach((b) => b.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.remove('open');
    open();
  }));
  addEventListener('keydown', (e) => {
    const typing = /^(input|textarea|select)$/i.test((e.target as HTMLElement)?.tagName ?? '') || (e.target as HTMLElement)?.isContentEditable;
    if ((e.key === '/' && !typing && !dialog.open) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); open(); }
  });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeSearch(); }); // Esc
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeSearch(); }); // click on the dimmed backdrop
  dialog.querySelector('[data-search-close]')!.addEventListener('click', () => closeSearch());
  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (shown.length) setActive((active + 1) % shown.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (shown.length) setActive((active - 1 + shown.length) % shown.length); }
    else if (e.key === 'Enter') { e.preventDefault(); const it = shown[Math.max(active, 0)]; if (it) go(it.h); }
  });
  results.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('.search-hit');
    if (!a) return;
    e.preventDefault();
    go(a.getAttribute('href')!);
  });
  results.addEventListener('mousemove', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLElement>('.search-hit');
    if (a && Number(a.dataset.i) !== active) setActive(Number(a.dataset.i));
  });
  dialog.addEventListener('click', (e) => {
    const chip = (e.target as HTMLElement).closest<HTMLElement>('[data-chip]');
    if (chip) { input.value = chip.dataset.chip!; render(); input.focus(); }
    const g = (e.target as HTMLElement).closest<HTMLElement>('[data-group]');
    if (g) {
      group = g.dataset.group!;
      filters.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === g)));
      render();
      input.focus();
    }
  });
}
