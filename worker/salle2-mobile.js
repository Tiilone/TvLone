// Salle 2 au téléphone (ajout propre à cette copie, absent du dépôt d'origine) : pensée comme une appli.
// - Ranger au doigt : chaque ligne qu'on peut monter ou descendre (rangées, ordre de l'accueil, plateformes,
//   tuiles des collections) reçoit une poignée ⠿ à faire glisser. Au lâcher, la page fait les mêmes
//   déplacements que ses flèches ↑ ↓, cachées (elle reste seule maîtresse de ses réglages). La poignée marche
//   au doigt, à la souris, et au clavier (↑ et ↓).
// - Les fenêtres (collections, ordre de l'accueil) et la création d'une rangée s'ouvrent en plein écran.
// - Une barre d'onglets en bas : Écran, Rangées, Ordre, Collections, Billet (à la place de la barre du billet).
// Si un repère manque (la page d'origine a changé), la partie concernée ne fait rien ; la page reste telle quelle.

const CSS = String.raw`
.nvm-poignee { flex: none; width: 44px; height: 44px; display: inline-grid; place-items: center; padding: 0; border: 0; border-radius: 10px;
  background: transparent; color: var(--dim); cursor: grab; touch-action: none; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
.nvm-poignee:hover, .nvm-poignee:focus-visible { color: var(--cream); background: rgba(255,255,255,.07); }
.nvm-poignee svg { width: 20px; height: 20px; pointer-events: none; }
@media (hover: hover) and (pointer: fine) { .nvm-poignee { width: 32px; height: 32px; } }
.acc-fleches, .tools { align-items: center; }
.tiles li { position: relative; }
.acc-item { position: relative; }
.nvm-tri { -webkit-user-select: none; user-select: none; }
.nvm-tri > li { transition: transform .2s cubic-bezier(.2,.8,.2,1); }
.nvm-tri > li.nvm-leve { transition: none; z-index: 16; cursor: grabbing; box-shadow: 0 18px 40px rgba(0,0,0,.55); outline: 2px solid var(--bulb); outline-offset: 1px; }
.nvm-tri > li.nvm-leve .nvm-poignee { color: var(--bulb); cursor: grabbing; }
html.nvm-glisse, html.nvm-glisse * { cursor: grabbing !important; }

/* La poignée remplace les flèches (au doigt, à la souris et au clavier). Les flèches restent dans la page,
   cachées : c'est par elles que passent les déplacements. */
#rows .arrow, .acc-list .arrow, .tiles .arrow { display: none; }
#rows .tools .nvm-poignee { margin-left: auto; }

/* La barre d'onglets du bas (téléphone et tablette). */
.nvm-barre { display: none; }
@media (max-width: 960px) {
  .dock { display: none !important; }
  .nvm-barre { position: fixed; left: 0; right: 0; bottom: 0; z-index: 21; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr));
    padding: 4px max(6px, env(safe-area-inset-right)) calc(4px + env(safe-area-inset-bottom)) max(6px, env(safe-area-inset-left));
    background: rgba(23,12,18,.94); -webkit-backdrop-filter: blur(12px) saturate(1.3); backdrop-filter: blur(12px) saturate(1.3); border-top: 1px solid var(--seat); }
  .nvm-barre button { min-height: 54px; display: grid; justify-items: center; align-content: center; gap: 3px; padding: 4px 0; border: 0; border-radius: 12px;
    background: none; color: var(--dim); font: 700 .68rem/1 var(--body); letter-spacing: .02em; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .nvm-barre button svg { width: 24px; height: 24px; }
  .nvm-barre button.on { color: var(--bulb); }
  .nvm-barre button:active { background: rgba(255,255,255,.06); }
  body:has(:is(input[type=text], input[type=password], input[type=number], input[type=search], select):focus) .nvm-barre,
  html:has(#builder:not([hidden])) .nvm-barre { display: none; }
}

/* Téléphone : rangées plus compactes, fenêtres et création de rangée en plein écran. */
@media (max-width: 760px) {
  #rows .frame small { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
  #coll-dialog, #acc-dialog { width: 100vw; max-width: 100vw; height: 100dvh; max-height: 100dvh; margin: 0; border: 0; border-radius: 0; overscroll-behavior: contain; }
  #coll-dialog[open], #acc-dialog[open] { animation: nvm-monte .3s cubic-bezier(.22,1,.36,1); }
  .coll-dlg-head { padding: calc(10px + env(safe-area-inset-top)) 16px 10px; }
  .coll-dlg-head h2 { font-size: 1.7rem; line-height: 1; }
  .coll-dlg-head .btn { min-height: 44px; padding-inline: 16px; }
  .coll-dlg-body { padding: 14px 14px calc(28px + env(safe-area-inset-bottom)); }
  #builder:not([hidden]) { position: fixed; inset: 0; z-index: 70; overflow-y: auto; overscroll-behavior: contain; align-content: start;
    border: 0; border-radius: 0; padding: calc(16px + env(safe-area-inset-top)) 16px 0; animation: nvm-monte .3s cubic-bezier(.22,1,.36,1); }
  #builder .b-actions { position: sticky; bottom: 0; z-index: 1; display: flex; flex-wrap: wrap; gap: 10px; margin: 0 -16px; padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
    background: #1d0f16; border-top: 1px solid var(--seat); }
  #builder .b-actions button { flex: 1 1 40%; min-height: 48px; }
  html:has(#builder:not([hidden])) { overflow: hidden; }
}
@keyframes nvm-monte { from { transform: translateY(48px); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .nvm-tri > li { transition: none; } #coll-dialog[open], #acc-dialog[open], #builder:not([hidden]) { animation: none; } }
`;

const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ONGLETS = [
  ["ecran", "Écran", '<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>'],
  ["rangees", "Rangées", '<path d="M4 6h16M4 12h16M4 18h10"/>'],
  ["ordre", "Ordre", '<path d="M8 4v16M4 8l4-4 4 4M16 20V4M12 16l4 4 4-4"/>'],
  ["collections", "Collections", '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>'],
  ["billet", "Billet", '<path d="M3 7.5V5h18v2.5a2.5 2.5 0 0 0 0 5V15H3v-2.5a2.5 2.5 0 0 0 0-5Z" transform="translate(0 2)"/><path d="M14 7v2M14 12v2" transform="translate(0 2)"/>'],
];
const BARRE = `<nav class="nvm-barre" aria-label="Raccourcis">${ONGLETS.map(([id, nom, d]) => `<button type="button" data-nvm="${id}">${svg(d)}<span>${nom}</span></button>`).join("")}</nav>`;
const POIGNEE = svg('<circle cx="9" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1.3" fill="currentColor" stroke="none"/>');

const JS = String.raw`(() => {
  const $ = (s, r) => (r || document).querySelector(s);
  const vibre = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} };

  // ---------- Ranger au doigt ----------
  const POIGNEE = ` + JSON.stringify(POIGNEE) + String.raw`;
  const fleche = (li, sens) => li.querySelector('.arrow[aria-label^="' + (sens < 0 ? "Monter" : "Descendre") + '"]');
  const mobile = (li) => li.tagName === "LI" && !!li.querySelector(".arrow");
  const cle = (li) => {
    if (li.dataset.cle) return li.dataset.cle;
    if (li.dataset.i) return "i:" + li.dataset.i;
    const a = li.querySelector(".arrow[data-cle]");
    return a ? a.dataset.cle.replace(/^[^:]*:/, "") : "";
  };
  const nom = (li) => ((li.querySelector("b") || li.querySelector("label span") || li).textContent || "").trim();
  const poignees = (ol) => {
    if (!ol) return;
    [...ol.children].forEach((li) => {
      if (!mobile(li) || li.querySelector(".nvm-poignee")) return;
      const b = document.createElement("button");
      b.type = "button"; b.className = "nvm-poignee"; b.innerHTML = POIGNEE;
      b.setAttribute("aria-label", "Déplacer " + nom(li) + " (glisser, ou flèches haut et bas)");
      (li.querySelector(":scope > .tools, :scope > .acc-fleches") || li).append(b);
    });
  };
  const retrouve = (ol, k) => [...ol.children].find((x) => mobile(x) && cle(x) === k);
  // Déplace la ligne de n places en passant par les flèches de la page (une à la fois, la page redessine la liste).
  const deplace = (ol, k, n) => {
    for (let s = 0; s < Math.abs(n); s++) {
      const li = retrouve(ol, k), bt = li && fleche(li, n);
      if (!bt || bt.disabled) break;
      bt.click();
    }
  };
  const suivre = (ol, sousArbre) => {
    if (!ol) return;
    const tout = () => (sousArbre ? ol.querySelectorAll(".tiles") : [ol]).forEach(poignees);
    tout();
    new MutationObserver(tout).observe(ol, { childList: true, subtree: !!sousArbre });
  };
  ["#rows", "#accueil-ordre", "#prov-ordre"].forEach((s) => suivre($(s)));
  // Les consignes parlent de glisser plutôt que de flèches.
  {
    const doigt = matchMedia("(hover: none), (pointer: coarse)").matches ? " du doigt" : "";
    [["#s-rangees .sub", /range-les avec les flèches/, "range-les en les faisant glisser" + doigt + " (⠿)"],
     ["#acc-dialog .sub", /monte ou descends chacune/, "fais glisser chacune" + doigt + " (⠿)"]].forEach(([s, re, par]) => {
      const p = $(s);
      if (p && re.test(p.innerHTML)) p.innerHTML = p.innerHTML.replace(re, par);
    });
  }
  suivre($("#collections"), true);

  const defileur = (n) => {
    for (let p = n.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p).overflowY;
      if ((o === "auto" || o === "scroll") && p.scrollHeight > p.clientHeight + 1) return p;
    }
    return null;
  };

  document.addEventListener("keydown", (e) => {
    const g = e.target.closest && e.target.closest(".nvm-poignee");
    if (!g || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
    e.preventDefault();
    const li = g.closest("li"), ol = li.parentElement, k = cle(li);
    deplace(ol, k, e.key === "ArrowUp" ? -1 : 1);
    poignees(ol);
    const apres = retrouve(ol, k), pg = apres && apres.querySelector(".nvm-poignee");
    if (pg) pg.focus();
  });

  document.addEventListener("pointerdown", (e) => {
    const g = e.target.closest && e.target.closest(".nvm-poignee");
    if (!g || e.button > 0) return;
    const li = g.closest("li"), ol = li && li.parentElement;
    if (!ol) return;
    const items = [...ol.children].filter(mobile), de = items.indexOf(li);
    if (de < 0 || items.length < 2) return;
    e.preventDefault();
    try { g.setPointerCapture(e.pointerId); } catch (err) {}
    const sc = defileur(ol);
    const haut = () => (sc ? sc.scrollTop : scrollY);
    const h0 = haut();
    const pos = items.map((x) => { const r = x.getBoundingClientRect(); return { t: r.top + h0, h: r.height }; });
    const pas = pos[de].h + (items.length > 1 ? Math.max(0, de > 0 ? pos[de].t - (pos[de - 1].t + pos[de - 1].h) : pos[1].t - (pos[0].t + pos[0].h)) : 6);
    const y0 = e.clientY;
    let y = y0, vers = de, boucle = 0, fini = false;
    li.classList.add("nvm-leve"); ol.classList.add("nvm-tri"); document.documentElement.classList.add("nvm-glisse");
    vibre(12);
    const dessine = () => {
      const dy = y - y0 + (haut() - h0);
      li.style.transform = "translateY(" + dy + "px) scale(1.02)";
      const c = pos[de].t + pos[de].h / 2 + dy;
      let v = de;
      for (let i = de + 1; i < items.length; i++) if (c > pos[i].t + pos[i].h / 2) v = i;
      for (let i = de - 1; i >= 0; i--) if (c < pos[i].t + pos[i].h / 2) v = i;
      if (v !== vers) { vers = v; vibre(6); }
      items.forEach((x, i) => {
        if (i === de) return;
        x.style.transform = i > de && i <= vers ? "translateY(" + -pas + "px)" : i < de && i >= vers ? "translateY(" + pas + "px)" : "";
      });
    };
    // Près du bord (de la fenêtre, ou de la liste qui défile), la page défile toute seule.
    const bords = () => {
      if (sc) { const r = sc.getBoundingClientRect(); return [r.top, r.bottom]; }
      const barre = document.querySelector(".nvm-barre");
      const bas = barre && getComputedStyle(barre).display !== "none" ? barre.getBoundingClientRect().top : innerHeight;
      const nav = document.querySelector(".nav"), dessus = nav && getComputedStyle(nav).position === "sticky" ? Math.max(0, nav.getBoundingClientRect().bottom) : 0;
      return [dessus, bas];
    };
    const roule = () => {
      if (fini) return;
      const [t, b] = bords(), zone = 72;
      let v = 0;
      if (y < t + zone) v = -Math.ceil((t + zone - y) / 5);
      else if (y > b - zone) v = Math.ceil((y - (b - zone)) / 5);
      if (v) { if (sc) sc.scrollTop += v; else scrollBy(0, v); dessine(); }
      boucle = requestAnimationFrame(roule);
    };
    boucle = requestAnimationFrame(roule);
    const bouge = (ev) => { if (ev.pointerId !== e.pointerId) return; y = ev.clientY; dessine(); };
    const fin = (ev) => {
      if (ev.pointerId !== e.pointerId) return;
      fini = true; cancelAnimationFrame(boucle);
      removeEventListener("pointermove", bouge); removeEventListener("pointerup", fin); removeEventListener("pointercancel", fin);
      ol.classList.remove("nvm-tri"); li.classList.remove("nvm-leve"); document.documentElement.classList.remove("nvm-glisse");
      items.forEach((x) => { x.style.transform = ""; });
      const n = ev.type === "pointercancel" ? 0 : vers - de;
      if (n) { deplace(ol, cle(li), n); vibre(10); }
    };
    addEventListener("pointermove", bouge, { passive: true });
    addEventListener("pointerup", fin);
    addEventListener("pointercancel", fin);
  });

  // ---------- La barre d'onglets ----------
  const barre = document.querySelector(".nvm-barre");
  if (!barre) return;
  // Défilement image par image (un défilement « smooth » du navigateur s'arrête en route : le sommaire du haut
  // se recentre en même temps). Un doigt posé sur l'écran l'arrête.
  const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let course = 0;
  addEventListener("touchstart", () => cancelAnimationFrame(course), { passive: true });
  addEventListener("wheel", () => cancelAnimationFrame(course), { passive: true });
  const va = (el) => {
    if (!el) return;
    cancelAnimationFrame(course);
    const nav = $(".nav");
    const marge = el.closest("main") && nav ? nav.getBoundingClientRect().height + 24 : 12;
    const de = scrollY, vers = Math.max(0, Math.min(el.getBoundingClientRect().top + scrollY - marge, document.scrollingElement.scrollHeight - innerHeight));
    if (calme || Math.abs(vers - de) < 2) { scrollTo(0, vers); return; }
    const duree = Math.min(900, 300 + Math.abs(vers - de) / 12), t0 = performance.now();
    const pas = (t) => {
      const k = Math.min(1, (t - t0) / duree), e = 1 - Math.pow(1 - k, 3);
      scrollTo(0, de + (vers - de) * e);
      if (k < 1) course = requestAnimationFrame(pas);
    };
    course = requestAnimationFrame(pas);
  };
  const cibles = { ecran: $("#stage"), rangees: $("#s-rangees"), billet: $("#ticket") };
  const actions = {
    ecran: () => va(cibles.ecran), rangees: () => va(cibles.rangees), billet: () => va(cibles.billet),
    ordre: () => { const b = $("#acc-ouvrir"); if (b) b.click(); },
    collections: () => { const b = $("#coll-ouvrir"); if (b) b.click(); },
  };
  barre.querySelectorAll("button[data-nvm]").forEach((b) => {
    const a = actions[b.dataset.nvm];
    if (!a || (b.dataset.nvm in cibles && !cibles[b.dataset.nvm]) || (b.dataset.nvm === "ordre" && !$("#acc-ouvrir")) || (b.dataset.nvm === "collections" && !$("#coll-ouvrir"))) { b.hidden = true; return; }
    b.addEventListener("click", a);
  });
  // L'onglet de ce qu'on a sous les yeux s'allume.
  if ("IntersectionObserver" in window) {
    const vus = new Map();
    const allume = () => {
      let mieux = null, max = 0;
      vus.forEach((r, id) => { if (r > max) { max = r; mieux = id; } });
      barre.querySelectorAll("button[data-nvm]").forEach((b) => b.classList.toggle("on", b.dataset.nvm === mieux));
    };
    const io = new IntersectionObserver((es) => {
      es.forEach((en) => vus.set(en.target.dataset.nvmCible, en.isIntersecting ? en.intersectionRect.height : 0));
      allume();
    }, { threshold: [0, .1, .25, .5, .75, 1] });
    Object.entries(cibles).forEach(([id, el]) => { if (el) { el.dataset.nvmCible = id; io.observe(el); } });
  }
})();`;

/** Ajoute à la salle 2 le rangement au doigt, les fenêtres plein écran et la barre d'onglets du téléphone. */
export function avecSalle2Mobile(page) {
  if (!page.includes('id="rows"') || !page.includes('id="accueil-ordre"')) return page;
  const ajout = `<style>${CSS}</style>${BARRE}<script>${JS}</script>`;
  const j = page.lastIndexOf("</body>");
  return j < 0 ? page + ajout : page.slice(0, j) + ajout + page.slice(j);
}
