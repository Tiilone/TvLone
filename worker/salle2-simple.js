// Salle 2, encadré « Mode d'emploi » plus clair (ajout propre à cette copie, absent du dépôt d'origine).
// Réécrit côté serveur la section #s-mode de page.js : d'abord le chemin avec un compte Nuvio (« Tout envoyer »),
// puis « Sans compte Nuvio » replié ; les longues explications passent dans des bulles « ? ».
// Les textes d'origine (étapes sans compte, paragraphes) sont repris tels quels : si la section change de forme
// dans le dépôt d'origine, la page reste telle quelle.

const CSS = `
#s-mode .nvs-titre { margin: 4px 0 10px; font-weight: 700; color: var(--cream, #f5ead8); }
#s-mode .nvs-sans { margin-top: 18px; border-top: 1px dashed rgba(255, 207, 107, .25); padding-top: 12px; }
#s-mode .nvs-sans > summary { cursor: pointer; font-weight: 700; color: var(--bulb, #ffcf6b); text-decoration: underline; text-underline-offset: 3px; }
#s-mode .nvs-sans[open] > summary { margin-bottom: 12px; }
#s-mode .nvs-sans > .sub { margin-top: 12px; }
#s-mode .nvs-plus { margin-top: 16px; }
.nvs-txt { display: none; }
.nvs-q { display: inline-grid; place-items: center; width: 1.35em; height: 1.35em; margin-left: .4em; padding: 0; vertical-align: .1em;
  font: 700 .8rem/1 var(--body, system-ui, sans-serif); color: var(--bulb, #ffcf6b); background: transparent;
  border: 1.5px solid currentColor; border-radius: 50%; cursor: help; opacity: .8; }
.nvs-q:hover, .nvs-q[aria-expanded="true"] { opacity: 1; background: rgba(255, 207, 107, .15); }
.nvs-q:focus-visible { outline: 2px solid var(--cream, #f5ead8); outline-offset: 2px; }
.nvs-bulle { position: fixed; z-index: 96; max-width: min(360px, calc(100vw - 32px)); padding: 12px 14px; border-radius: 10px;
  background: var(--seat, #3d2230); color: var(--cream, #f5ead8); border: 1px solid rgba(255, 207, 107, .45);
  box-shadow: 0 10px 30px rgba(0, 0, 0, .5); font: 400 .9rem/1.45 var(--body, system-ui, sans-serif); text-align: left; }
.nvs-bulle[hidden] { display: none; }
.nvs-bulle a { color: var(--bulb, #ffcf6b); }
`;

// Bulles « ? » : survol à la souris, toucher ou clavier ; le texte vient du <span class="nvs-txt"> qui suit.
const JS = `(() => {
  const bulle = document.createElement("div");
  bulle.className = "nvs-bulle"; bulle.setAttribute("role", "tooltip"); bulle.id = "nvs-bulle"; bulle.hidden = true;
  document.body.appendChild(bulle);
  let ouvert = null, epingle = false, t = 0;
  const placer = (b) => {
    const r = b.getBoundingClientRect(); bulle.style.left = "0px"; bulle.style.top = "0px";
    const w = bulle.getBoundingClientRect();
    const x = Math.max(16, Math.min(r.left + r.width / 2 - w.width / 2, innerWidth - w.width - 16));
    let y = r.bottom + 8; if (y + w.height > innerHeight - 8 && r.top - w.height - 8 > 8) y = r.top - w.height - 8;
    bulle.style.left = x + "px"; bulle.style.top = y + "px";
  };
  const montrer = (b) => {
    clearTimeout(t);
    if (ouvert && ouvert !== b) ouvert.setAttribute("aria-expanded", "false");
    ouvert = b; b.setAttribute("aria-expanded", "true");
    const s = b.nextElementSibling; bulle.innerHTML = s && s.classList.contains("nvs-txt") ? s.innerHTML : "";
    bulle.hidden = false; placer(b);
  };
  const cacher = () => { if (ouvert) ouvert.setAttribute("aria-expanded", "false"); ouvert = null; epingle = false; bulle.hidden = true; };
  document.querySelectorAll(".nvs-q").forEach((b) => {
    b.addEventListener("mouseenter", () => { if (!epingle) montrer(b); });
    b.addEventListener("mouseleave", () => { if (!epingle) t = setTimeout(() => { if (!epingle && !bulle.matches(":hover")) cacher(); }, 150); });
    b.addEventListener("focus", () => { if (!epingle) montrer(b); });
    b.addEventListener("blur", () => { if (!epingle) cacher(); });
    b.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); if (ouvert === b && epingle) cacher(); else { montrer(b); epingle = true; } });
  });
  bulle.addEventListener("mouseenter", () => clearTimeout(t));
  bulle.addEventListener("mouseleave", () => { if (!epingle) cacher(); });
  document.addEventListener("click", (e) => { if (ouvert && !e.target.closest(".nvs-q,.nvs-bulle")) cacher(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cacher(); });
  addEventListener("scroll", () => { if (ouvert) placer(ouvert); }, { passive: true });
  addEventListener("resize", () => { if (ouvert) placer(ouvert); });
})();`;

const q = (html) => `<button type="button" class="nvs-q" aria-label="Pourquoi ?" aria-expanded="false" aria-describedby="nvs-bulle">?</button><span class="nvs-txt">${html}</span>`;

/** Réécrit l'encadré « Mode d'emploi » de la salle 2. Page inchangée si la section n'a plus la forme attendue. */
export function avecSalle2Simple(page) {
  const ouv = '<section class="act" id="s-mode">';
  const i = page.indexOf(ouv);
  const fin = i < 0 ? -1 : page.indexOf("</section>", i);
  if (fin < 0) return page;
  const section = page.slice(i, fin);
  const header = (section.match(/<header>[\s\S]*?<\/header>/) || [])[0];
  const etapes = [...section.matchAll(/<li>[\s\S]*?<\/li>/g)].map((m) => m[0]);
  const paras = [...section.matchAll(/<p class="sub">([\s\S]*?)<\/p>/g)].map((m) => m[1]);
  if (!header || etapes.length !== 4 || paras.length !== 3 || !/QR code/.test(etapes[0]) || !/Tu pars de zéro/.test(paras[2])) return page;

  const guide = (paras[2].match(/Tu pars de zéro \?[\s\S]*$/) || [""])[0];
  const plusTard = paras[2].slice(0, paras[2].length - guide.length).trim();

  const nouvelle = `${ouv}
        ${header}
        <p class="nvs-titre">Avec un compte Nuvio</p>
        <ol class="steps-howto">
          <li><span><b>Connecte ta TV à ton compte Nuvio</b> et ouvre Nuvio une fois.${q("Sans ça, le lien des affiches n'arrive pas sur la TV (l'addon et les collections, si). Pareil sur chaque appareil : téléphone, tablette, ordinateur.")}</span></li>
          <li><span>Sur ton billet, appuie sur <b>Tout envoyer dans Nuvio</b>.${q("L'addon, les collections, l'ordre de l'accueil et les affiches arrivent tout seuls sur tes appareils connectés au compte : rien à coller.")}</span></li>
          <li><span><b>Mets Nuvio en français</b> : Paramètres → Langue de l'application → Français, puis Paramètres → Intégrations → TMDB → Langue → Français.${q(`Ces réglages ne passent pas par le compte : ils se font sur chaque appareil. Dans TMDB, désactive aussi Bandes-annonces, Informations de base, Détails et Illustrations (détails à l'étape 3 du <a href="/guide#francais">guide</a>).`)}</span></li>
        </ol>
        <details class="nvs-sans">
          <summary>Sans compte Nuvio</summary>
          <ol class="steps-howto">
          ${etapes.slice(0, 3).join("\n          ")}
          <li><span><b>Mets Nuvio en français</b> (comme à l'étape 3 ci-dessus).</span></li>
          </ol>
          <p class="sub">${paras[1]}</p>
        </details>
        ${plusTard ? `<p class="sub nvs-plus">Retrouver ou modifier tes réglages plus tard${q(plusTard)}</p>` : ""}
        ${guide ? `<p class="sub">${guide}</p>` : ""}
      `;
  const out = page.slice(0, i) + nouvelle + page.slice(fin);
  const j = out.lastIndexOf("</body>");
  const ajout = `<style>${CSS}</style><script>${JS}</script>`;
  return j < 0 ? out + ajout : out.slice(0, j) + ajout + out.slice(j);
}
