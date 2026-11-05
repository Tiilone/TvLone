// Salle 2 : le lien fixe en avant sur le billet (ajout propre à cette copie, absent du dépôt d'origine).
// Le bloc « Lien fixe » (#fixe) était rangé dans « Installer à la main, sans compte Nuvio », replié : on ne le voyait
// pas, et « Voir mon billet » de « Mes profils » (profils.js) défilait vers un bloc caché, sans effet. Il passe en haut
// du billet, avant « Tout envoyer dans Nuvio » (le lien fixe se crée avant d'installer). « Voir mon billet » l'éclaire
// un instant et donne la main à « Créer mon lien fixe ». Ses textes (salle2.js) ne parlent plus du « lien du dessus »,
// resté dans « Installer à la main ». Si la page ou le script changent de forme, ils restent tels quels.

const FIXE = /\s*<div class="fixe" id="fixe" hidden>[^]*?<p class="alerte" id="fixe-err" role="alert"><\/p>\s*<\/div>/;
const ENVOI = '<div class="compte-nuvio">';

const CSS = `
#ticket .main > .fixe { margin-bottom: 2px; }
#fixe.nvf-vu { animation: nvf-vu 1.1s ease-in-out 2; }
@keyframes nvf-vu { 50% { border-color: var(--red, #e5413a); box-shadow: 0 0 0 4px rgba(229, 65, 58, .25); } }
@media (prefers-reduced-motion: reduce) { #fixe.nvf-vu { animation: none; border-color: var(--red, #e5413a); } }
`;

// « Voir mon billet » (Mes profils) : la page défile jusqu'au bloc, qui s'éclaire, puis le bouton « Créer mon lien
// fixe » prend la main. Défilement fait ici (le doux du navigateur s'arrête net quand le sommaire .nav défile lui aussi) ;
// le clic ne va donc plus jusqu'au bouton d'origine.
const JS = `(() => {
  const liste = document.getElementById("profils-liste"), fixe = document.getElementById("fixe");
  if (!liste || !fixe) return;
  const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const va = (y) => {
    const d = scrollY, n = Math.max(0, Math.min(y, document.documentElement.scrollHeight - innerHeight)) - d, t0 = performance.now();
    if (calme || Math.abs(n) < 4) { scrollTo(0, d + n); return; }
    let fini = false; const stop = () => { fini = true; };
    addEventListener("wheel", stop, { once: true, passive: true }); addEventListener("touchstart", stop, { once: true, passive: true });
    const pas = (t) => { if (fini) return; const k = Math.min(1, (t - t0) / 600); scrollTo(0, d + n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(pas); };
    requestAnimationFrame(pas);
  };
  liste.addEventListener("click", (e) => {
    if (!e.target.closest(".profil.ajout button") || fixe.hidden) return;
    e.stopPropagation();
    const r = fixe.getBoundingClientRect();
    va(scrollY + r.top - Math.max(16, (innerHeight - r.height) / 2));
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
