// Salle 2 : le lien fixe en avant sur le billet (ajout propre à cette copie, absent du dépôt d'origine).
// Le bloc « Lien fixe » (#fixe) était rangé dans « Installer à la main, sans compte Nuvio », replié : on ne le voyait
// pas, et « Voir mon billet » de « Mes profils » (profils.js) défilait vers un bloc caché, sans effet. Il passe en haut
// du billet, avant « Tout envoyer dans Nuvio » (le lien fixe se crée avant d'installer). « Voir mon billet » l'éclaire
// un instant et donne la main à « Créer mon lien fixe ». Ses textes (salle2.js) ne parlent plus du « lien du dessus »,
// resté dans « Installer à la main ». Si la page ou le script changent de forme, ils restent tels quels.

const FIXE = /\s*<div class="fixe" id="fixe" hidden>[^]*?<p class="alerte" id="fixe-err" role="alert"><\/p>\s*<\/div>/;
const ENVOI = '<div class="compte-nuvio">';

// Écran et billet trop hauts ensemble pour la fenêtre (aside.long, page.js) : la salle 2 d'origine laisse alors le
// billet en bas de la colonne, loin de l'aperçu. Ici la colonne reste entière (écran puis billet) et accompagne la page :
// en descendant, elle défile avec elle jusqu'à montrer le bas du billet, puis reste en place ; en remontant, jusqu'à
// montrer le haut de l'écran. Pas de défilement à part, rien de coupé.
const CSS = `
@media (min-width: 961px) {
  aside.long { position: sticky; top: 18px; align-self: start; grid-template-rows: none; }
  aside.long .stage:not(.big) { position: relative; top: auto; }
}
#ticket .main > .fixe { margin-bottom: 2px; }
#fixe.nvf-vu { animation: nvf-vu 1.1s ease-in-out 2; }
@keyframes nvf-vu { 50% { border-color: var(--red, #e5413a); box-shadow: 0 0 0 4px rgba(229, 65, 58, .25); } }
@media (prefers-reduced-motion: reduce) { #fixe.nvf-vu { animation: none; border-color: var(--red, #e5413a); } }
`;

// « Voir mon billet » (Mes profils) : la page défile jusqu'au bloc, qui s'éclaire, puis le bouton « Créer mon lien
// fixe » prend la main. Défilement fait ici (le doux du navigateur s'arrête net quand le sommaire .nav défile lui aussi) ;
// le clic ne va donc plus jusqu'au bouton d'origine.
const JS = `(() => {
  // La colonne longue accompagne la page (voir CSS) : son « top » collant suit le défilement, entre le haut de l'écran
  // visible (18 px) et le bas du billet visible. La salle 2 remet ce top à vide quand elle recalcule la colonne.
  const col = document.querySelector("aside");
  if (col) {
    let haut = 18, avant = scrollY;
    const suit = () => {
      const d = scrollY - avant; avant = scrollY;
      if (!col.classList.contains("long") || matchMedia("(max-width: 960px)").matches) { haut = 18; return; }
      const bas = Math.min(18, innerHeight - col.offsetHeight - 18);
      haut = Math.max(bas, Math.min(18, haut - d));
      col.style.top = haut + "px";
    };
    addEventListener("scroll", suit, { passive: true });
    addEventListener("resize", suit);
    new ResizeObserver(() => { avant = scrollY; suit(); }).observe(col);
  }
  const liste = document.getElementById("profils-liste"), fixe = document.getElementById("fixe");
  if (!liste || !fixe) return;
  const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Défile la page jusqu'à y, puis appelle fin.
  const va = (y, fin) => {
    const d = scrollY, n = Math.max(0, Math.min(y, document.documentElement.scrollHeight - innerHeight)) - d, t0 = performance.now();
    if (calme || Math.abs(n) < 4) { scrollTo(0, d + n); if (fin) requestAnimationFrame(fin); return; }
    let fini = false; const stop = () => { fini = true; };
    addEventListener("wheel", stop, { once: true, passive: true }); addEventListener("touchstart", stop, { once: true, passive: true });
    const pas = (t) => { if (fini) return; const k = Math.min(1, (t - t0) / 600); scrollTo(0, d + n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(pas); else if (fin) requestAnimationFrame(fin); };
    requestAnimationFrame(pas);
  };
  // Le bloc au milieu de la fenêtre ; la colonne qui accompagne la page bouge moins qu'elle, d'où quelques reprises.
  const centre = (essais) => {
    const r = fixe.getBoundingClientRect(), ecart = r.top - Math.max(16, (innerHeight - r.height) / 2);
    if (Math.abs(ecart) > 24 && essais > 0) va(scrollY + ecart, () => centre(essais - 1));
  };
  liste.addEventListener("click", (e) => {
    if (!e.target.closest(".profil.ajout button") || fixe.hidden) return;
    e.stopPropagation();
    centre(3);
    fixe.classList.remove("nvf-vu"); void fixe.offsetWidth; fixe.classList.add("nvf-vu");
    setTimeout(() => fixe.classList.remove("nvf-vu"), 2400);
    const b = document.getElementById("fixe-creer");
    if (b && !b.hidden) setTimeout(() => b.focus({ preventScroll: true }), 650);
  }, true);
})();`;

/** Billet de la salle 2 : le lien fixe en haut, avant « Tout envoyer dans Nuvio ». Page inchangée si un repère manque. */
export function avecFixeEnAvant(page) {
  const m = page.match(FIXE);
  if (!m || !page.includes(ENVOI)) return page;
  const sans = page.replace(FIXE, "");
  const out = sans.replace(ENVOI, () => m[0].trim() + "\n          " + ENVOI);
  const j = out.lastIndexOf("</body>");
  const ajout = `<style>${CSS}</style><script>${JS}</script>`;
  return j < 0 ? out + ajout : out.slice(0, j) + ajout + out.slice(j);
}

// Les textes du bloc (salle2.js, dessineFixe).
const TEXTES = [
  ["\"crée-le avant d'installer l'addon. Ensuite, plus besoin de réinstaller quand tu changes tes réglages.\"",
    "\"crée-le avant d'installer l'addon. Ensuite, plus besoin de réinstaller quand tu changes tes réglages, et tu peux faire un profil par personne (Mes profils, en haut de la page).\""],
  ["\"C'est le lien du dessus qu'on colle dans Nuvio, une seule fois. Ensuite tes changements s'enregistrent tout seuls : dans Nuvio, « Actualiser les addons » et c'est à jour. \"",
    "\"Il s'installe une seule fois, avec « Tout envoyer dans Nuvio » (ou à la main, plus bas). Ensuite tes changements s'enregistrent tout seuls : dans Nuvio, « Actualiser les addons » et c'est à jour. \""],
];

/** Le script salle2.js avec les textes du lien fixe placé en haut du billet. */
export const fixeTextes = (js) => TEXTES.reduce((s, [a, b]) => s.replace(a, () => b), js);
