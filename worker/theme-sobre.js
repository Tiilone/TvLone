// Thème « Sobre » (ajout propre à cette copie, absent du dépôt d'origine) : le thème par défaut de tout le site.
// Pas de décor de cinéma (rideau, draperies, ouvreuse, pop-corn, générique, secrets…), un fond uni, des titres
// dans la police du texte, des cartes simples. Ajouté à la fin de scene.css et scene.js (statique.js) ; le choix
// par défaut est dans STAGE_HEAD (stage.js). Un bouton dans la barre du haut rebascule vers le décor de cinéma.

const S = '[data-theme="sobre"]';
const tous = (sels) => sels.split(",").map((x) => `${S} ${x.trim()}`).join(", ");

export const SOBRE_CSS = `
/* ---------- Thème Sobre ---------- */
:root${S} {
  --velvet: #121214; --velvet-2: #1a1b1f; --seat: #2b2c33; --cream: #ecebe8; --dim: #a4a3ab; --ink: #17171a;
  --display: var(--body); --serif: var(--body); --type: var(--body);
}
${S} body { background: var(--velvet) !important; padding-top: max(24px, calc(env(safe-area-inset-top) + 16px)) !important; }
${S} body::after, ${S} body::before { display: none !important; }

/* Le décor et les jeux */
${tous(`.valance, .curtain, .iris, .torch, .draperie, .saison, .toiles, .decor-salle, .secret, .seats, .generique,
  .applaudimetre, .pot, .ouvreuse, .o-faisceau, .vendeuse, .entracte, .lustre, .soucoupe, .cabine, .beam, .chauve-souris,
  .muet-fx, .pianiste, .voiture, .ampoules, .reclames, #r-dots, .trophees, #trophees, #lumieres, #son, .dossiers2, .tete,
  .porte .encadrement, .marquee::before, .marquee::after, .act::before, .act .num::before, .act .num::after`)} { display: none !important; }
${tous(".marquee, .marquee *, .act, .act *, .salle, .toc, .nav")} { animation: none !important; }

/* Titre de page : plus d'enseigne lumineuse */
${S} .marquee { background: none !important; border: 0 !important; box-shadow: none !important; padding: 0 !important; border-radius: 0 !important; }
${S} .marquee h1 { font: 800 clamp(2rem, 4.6vw, 3rem)/1.1 var(--body) !important; letter-spacing: -.015em !important; text-transform: none !important;
  color: var(--cream) !important; text-shadow: none !important; }
${S} .marquee small { font: 600 .74rem var(--body) !important; letter-spacing: .14em !important; color: var(--dim) !important; text-shadow: none !important; }
${S} .tagline { font: 400 1.05rem/1.5 var(--body) !important; font-style: normal !important; color: var(--dim) !important; text-shadow: none !important; }

/* Barre du haut : onglets simples au lieu des plaques dorées */
${S} .salle { background: transparent !important; border: 1px solid var(--seat) !important; color: var(--cream) !important; box-shadow: none !important;
  text-shadow: none !important; border-radius: 10px !important; }
${S} .salle::before, ${S} .salle::after { display: none !important; }
${S} .salle[aria-current="page"] { border-color: var(--bulb) !important; background: rgba(255, 207, 107, .08) !important; }
${S} .salle b { font: 700 .9rem var(--body) !important; letter-spacing: 0 !important; text-transform: none !important; }
${S} .salle span { color: var(--dim) !important; font-weight: 500 !important; }

/* Cartes, sommaire, barres d'onglets */
${S} .act, ${S} .toc, ${S} .nav { background: var(--velvet-2) !important; border: 1px solid var(--seat) !important; box-shadow: none !important; border-radius: 14px !important; }
${S} .act h2, ${S} .act h3, ${S} main h2 { font-family: var(--body) !important; font-weight: 700 !important; letter-spacing: -.01em !important; text-transform: none !important;
  text-shadow: none !important; }
${S} .act h2 { font-size: 1.45rem !important; line-height: 1.25 !important; }
${S} .act .label, ${S} .act header > span:first-child:not(.num) { background: none !important; color: var(--dim) !important; padding: 0 !important; border: 0 !important;
  transform: none !important; border-radius: 0 !important; box-shadow: none !important; font: 600 .72rem var(--body) !important; letter-spacing: .12em !important; text-transform: uppercase; }
${S} .act .num { width: 44px !important; height: 44px !important; background: none !important; border: 1px solid rgba(255, 207, 107, .4) !important;
  box-shadow: none !important; font: 700 1.05rem var(--body) !important; color: var(--bulb) !important; text-shadow: none !important; }

/* Hall : les portes deviennent des cartes */
${S} .plaque-porte { background: none !important; box-shadow: none !important; border: 0 !important; color: var(--dim) !important;
  font: 600 .74rem var(--body) !important; letter-spacing: .14em !important; text-transform: uppercase; padding: 0 !important; }
${S} .porte .texte b { font-family: var(--body) !important; font-weight: 700 !important; text-transform: none !important; letter-spacing: -.01em !important; }

/* Boutons sans halo ni néon */
${S} .raccourci, ${S} .voir-resultat, ${S} .vers-tel { box-shadow: none !important; text-shadow: none !important; }
${S} .sortie { background: var(--velvet-2) !important; color: var(--cream) !important; border: 1px solid var(--seat) !important; box-shadow: none !important; text-shadow: none !important; }
${S} .sortie::before, ${S} .sortie::after { display: none !important; }
${S} .sortie b, ${S} .sortie span, ${S} .sortie small { font-family: var(--body) !important; letter-spacing: 0 !important; text-shadow: none !important; }

/* Le bouton pour passer d'un mode à l'autre */
.nvs-sobre-btn { font: 600 .82rem var(--body, system-ui, sans-serif); color: var(--cream, #f5ead8); background: transparent;
  border: 1px solid rgba(255, 255, 255, .18); border-radius: 999px; padding: 7px 14px; cursor: pointer; }
.nvs-sobre-btn:hover { border-color: var(--bulb, #ffcf6b); }
.nvs-sobre-btn:focus-visible { outline: 2px solid var(--bulb, #ffcf6b); outline-offset: 2px; }
`;

export const SOBRE_JS = `
(() => {
  const root = document.documentElement, regie = document.querySelector(".foyer .regie");
  if (!regie || regie.querySelector(".nvs-sobre-btn")) return;
  const sobre = root.dataset.theme === "sobre";
  const b = document.createElement("button");
  b.type = "button"; b.className = "nvs-sobre-btn";
  b.textContent = sobre ? "Décor cinéma" : "Mode sobre";
  b.title = sobre ? "Afficher la salle de cinéma (rideau, ouvreuse, thèmes…)" : "Revenir à l'affichage sobre";
  b.addEventListener("click", () => {
    try { localStorage.setItem("theme", sobre ? "classique" : "sobre"); } catch (e) {}
    location.reload();
  });
  regie.prepend(b);
  // Les messages des jeux de la salle (pop-corn…) n'ont plus lieu d'être.
  const toast = document.querySelector(".toast");
  if (sobre && toast) new MutationObserver(() => { if (/pop-corn|secret|applaudi/i.test(toast.textContent)) toast.style.visibility = "hidden"; else toast.style.visibility = ""; }).observe(toast, { childList: true, characterData: true, subtree: true, attributes: true });
})();
`;
