// Espace hébergeur discret (ajout propre à cette copie, absent du dépôt d'origine).
// - Salle 2 : l'encadré « Espace hébergeur » et son lien « Hébergeur » du menu ne se voient que si l'hébergeur est
//   connecté (il y règle les alertes de mise à jour de son lien) ; les visiteurs ne voient plus de champ de mot de
//   passe. Un lien /configure#s-hote, sans être connecté, mène en bas de /nouveautes. Sans texte d'introduction.
// - /nouveautes, tout en bas : la connexion, la nouvelle version, « Mettre à jour » / « Plus tard », la déconnexion
//   (le script de la salle 2, HOTE_JS, avec ce qu'il y trouve d'ordinaire : D, $, el). La case des alertes, qui
//   change le lien de la salle 2, y est remplacée par un lien vers la salle 2.
// Si une page change de forme dans le dépôt d'origine, elle reste telle quelle.
import { HOTE_JS } from "./page.js";

const SECTION = /(<section class="act" id="s-hote">\s*<header>[^]*?<\/header>)\s*<p class="sub">[^]*?<\/p>/;

const CSS_SALLE2 = `#s-hote:not(.nvh-on), .nav a[href="#s-hote"]:not(.nvh-on) { display: none !important; }`;

const JS_SALLE2 = `(() => {
  const s = document.getElementById("s-hote"), a = document.querySelector('.nav a[href="#s-hote"]');
  if (!s) return;
  // L'ancre demandée : la salle 2 réécrit l'adresse au chargement (hashDepart, dans salle2.js).
  const ancre = typeof hashDepart === "string" ? hashDepart : location.hash;
  fetch(location.origin + "/hote/etat", { credentials: "same-origin" }).then((r) => r.json()).then((e) => {
    if (e && e.hote) { s.classList.add("nvh-on"); if (a) a.classList.add("nvh-on"); if (ancre === "#s-hote") s.scrollIntoView(); }
    else if (ancre === "#s-hote") location.replace(location.origin + "/nouveautes#s-hote");
  }).catch(() => {});
})();`;

/** Salle 2 : espace hébergeur caché aux visiteurs, sans texte d'introduction. Page inchangée si un repère manque. */
export function avecHoteDiscret(page) {
  if (!SECTION.test(page)) return page;
  const out = page.replace(SECTION, "$1");
  const j = out.lastIndexOf("</body>");
  const ajout = `<style>${CSS_SALLE2}</style><script>${JS_SALLE2}</script>`;
  return j < 0 ? out + ajout : out.slice(0, j) + ajout + out.slice(j);
}

const CSS_NOUV = `
.hote { display: grid; gap: 12px; padding: 18px; border-radius: 16px; background: var(--velvet-2); border: 1px solid var(--seat); scroll-margin-top: 16px; }
.hote .sub { color: var(--dim); }
.hote .alerte { color: #ffb4a8; font-weight: 600; }
.hote .alerte:empty { display: none; }
.hote-box { display: grid; gap: 12px; }
.hote-ligne { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.hote-ligne input { flex: 1; min-width: 0; font: 600 1rem "Figtree", system-ui, sans-serif; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--seat); background: var(--velvet); color: var(--cream); }
.hote-btn { padding: 10px 14px; border-radius: 8px; border: 1px solid var(--cream); background: var(--cream); color: var(--ink); font: 700 .9rem "Figtree", system-ui, sans-serif; cursor: pointer; }
.hote-btn.line { background: transparent; color: var(--cream); justify-self: start; }
.hote-maj { border: 1px solid var(--red); border-radius: 12px; padding: 14px 16px; display: grid; gap: 10px; background: var(--velvet); }
.hote-maj ul { margin: 0; padding-left: 1.2em; color: var(--dim); }
.hote-maj a { color: var(--cream); }
.hote-how { display: grid; gap: 8px; color: var(--dim); }
.hote-how[hidden] { display: none; }
.hote-how code { display: block; padding: 8px 10px; border-radius: 6px; background: var(--velvet-2); color: var(--cream); user-select: all; overflow-wrap: anywhere; white-space: normal; }
`;

const HTML_NOUV = `
  <section class="hote" id="s-hote" aria-labelledby="hote-titre">
    <h2 id="hote-titre">Espace hébergeur</h2>
    <div id="hote-box" class="hote-box"></div>
  </section>
`;

// Ce que HOTE_JS trouve d'ordinaire dans la salle 2.
const JS_NOUV = `(() => {
const D = { origin: location.origin };
const $ = (id) => document.getElementById(id);
function el(tag, props, ...kids) {
  const n = document.createElement(tag);
  if (props) for (const [k, v] of Object.entries(props)) {
    if (k === "class") n.className = v; else if (k === "text") n.textContent = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else if (v !== undefined && v !== null) n.setAttribute(k, v);
  }
  kids.flat().forEach(k => k && n.append(k));
  return n;
}
const state = {}; const update = () => {};
${HOTE_JS}
// La case des alertes change le lien de la salle 2 : elle reste là-bas.
const dessine = hoteRender;
hoteRender = function () {
  dessine();
  const c = document.getElementById("hote-alertes"), l = c && c.closest("label");
  if (l) l.replaceWith(el("p", { class: "sub" }, "Alertes de mise à jour dans Nuvio : ", el("a", { href: D.origin + "/configure#s-hote", text: "à régler dans la salle 2" }), "."));
};
})();`;

/** /nouveautes : l'espace hébergeur tout en bas, sur une copie seulement. Page inchangée si le repère manque. */
export function avecHoteEnBas(page, copie) {
  const bas = '<nav class="fin"';
  if (!copie || !page.includes(bas) || !page.includes("</head>")) return page;
  return page
    .replace("</head>", () => `<style>${CSS_NOUV}</style>\n</head>`)
    .replace(bas, () => HTML_NOUV.trimStart() + "\n  " + bas)
    .replace("</body>", () => `<script>${JS_NOUV}</script>\n</body>`);
}
