// Page « Tout envoyer dans Nuvio » (/compte-nuvio) : un interrupteur « Tuiles animées » sous « Les collections »
// (ajout propre à cette copie, absent du dépôt d'origine). Coché (par défaut) : les collections partent telles
// quelles : une tuile sélectionnée s'anime (son GIF) et une vidéo joue en fond d'écran (heroVideoUrl). Décoché :
// chaque tuile part sans son GIF (focusGifUrl) ni sa vidéo de fond (heroVideoUrl), et avec focusGifEnabled à false :
// Nuvio montre alors la couverture (coverImageUrl) et l'image de fond (heroBackdropUrl). Couper l'interrupteur
// focusGifEnabled ne suffit pas : l'appli téléphone et ordinateur a son propre « Afficher le GIF si configuré »,
// gardé sur l'appareil et jamais lu dans le compte, et la vidéo de fond n'a pas d'interrupteur. Seules nos collections sont
// touchées (celles faites dans Nuvio restent telles quelles). Le choix est gardé dans ce navigateur.
// Si la page d'origine change de forme, elle reste telle quelle.

import { NOUVEAUTES } from "./nouveautes.js";

const CLE = "nvs-gifs";

const CSS = `
.switch.nvs-sous { margin-left: 58px; padding-top: 0; }
.switch.nvs-sous:has(input:disabled) { opacity: .45; cursor: default; }
@media (max-width: 480px) { .switch.nvs-sous { margin-left: 24px; } }
`;

const CASE = `<label class="switch nvs-sous"><input type="checkbox" id="e-gifs" checked><span><b>Tuiles animées</b><small>Les tuiles des collections s'animent quand tu t'arrêtes dessus (GIF sur la tuile, vidéo en fond d'écran). Décoche pour des tuiles fixes, moins gourmandes en ressources.</small></span></label>`;

// Dans le script de la page, juste avant l'envoi des collections.
const ENVOI = `
  // Tuiles animées (ajout de cette copie) : décoché, nos tuiles partent sans GIF au focus ni vidéo de fond.
  const sansGifs = () => { const c = $("e-gifs"); return !!c && !c.checked; };
  const avecGifs = (cols) => !sansGifs() ? cols : cols.map((col) => (col && Array.isArray(col.folders)
    ? { ...col, folders: col.folders.map((f) => (f && typeof f === "object" ? Object.assign({}, f, { focusGifEnabled: false, focusGifUrl: undefined, heroVideoUrl: undefined }) : f)) } : col));
`;

// Coché selon ce navigateur ; grisé quand « Les collections » ne part pas.
const JS = `(() => {
  const g = document.getElementById("e-gifs"), coll = document.getElementById("e-coll");
  if (!g || !coll) return;
  try { g.checked = localStorage.getItem(${JSON.stringify(CLE)}) !== "0"; } catch (e) {}
  g.addEventListener("change", () => { try { localStorage.setItem(${JSON.stringify(CLE)}, g.checked ? "1" : "0"); } catch (e) {} });
  const suit = () => { g.disabled = !coll.checked; };
  coll.addEventListener("change", suit); suit();
})();`;

/** Ajoute l'interrupteur « Tuiles animées » à la page /compte-nuvio. Page inchangée si un repère manque. */
export function avecChoixGifs(page) {
  const caseColl = /<label class="switch"><input type="checkbox" id="e-coll"[^]*?<\/label>/;
  const envoiColl = "  const envoiCollections = async";
  const fusionNos = /(const liste = fusion\(avant, )nos(, )/;
  const bilanColl = /(return "Les collections : " \+ nos\.length)/;
  if (!caseColl.test(page) || !page.includes(envoiColl) || !fusionNos.test(page)) return page;
  const out = page
    .replace(caseColl, (m) => m + "\n      " + CASE)
    .replace(envoiColl, () => ENVOI + envoiColl)
    .replace(fusionNos, "$1avecGifs(nos)$2")
    .replace(bilanColl, '$1 + (sansGifs() ? " (tuiles fixes)" : "")');
  const j = out.lastIndexOf("</body>");
  const ajout = `<style>${CSS}</style><script>${JS}</script>`;
  return j < 0 ? out + ajout : out.slice(0, j) + ajout + out.slice(j);
}

// Le dépôt d'origine (v5.58) a ajouté le même choix dans la salle 2 (« Vidéo de fond des tuiles », « Tuiles animées »,
// cfg.sv / cfg.sg). Cette copie le laisse à l'envoi dans Nuvio (ci-dessus) : les deux interrupteurs de la salle 2 sont
// masqués (le script de la salle 2 les lit toujours, ils restent dans la page), et un lien qui les avait décochés
// avant garde ses tuiles animées : c'est l'envoi qui décide.
const SALLE2_CSS = `<style>label.switch:has(#g-coll-video), label.switch:has(#g-coll-gif) { display: none !important; }</style>`;

/** Salle 2 : sans les interrupteurs de tuiles d'origine (le choix se fait à l'envoi). */
export function sansChoixTuilesSalle2(page) {
  if (!page.includes('id="g-coll-video"') && !page.includes('id="g-coll-gif"')) return page;
  const j = page.lastIndexOf("</body>");
  return j < 0 ? page + SALLE2_CSS : page.slice(0, j) + SALLE2_CSS + page.slice(j);
}

/** Réglages d'un lien sans les choix de tuiles de la salle 2 (masqués dans cette copie). */
export const sansChoixTuiles = (cfg) => (cfg && (cfg.sv || cfg.sg) ? { ...cfg, sv: false, sg: false } : cfg);

// Nouveautés (page /nouveautes et bandeau du hall) : l'annonce d'origine des interrupteurs de la salle 2 est remplacée
// par celle du choix à l'envoi. Repérée par ses deux noms d'interrupteurs ; sans elle, rien ne change.
export const NOUVEAUTE_TUILES = "Collections : au moment de « Tout envoyer dans Nuvio », l'interrupteur « Tuiles animées » sous « Les collections » : décoche-le pour des tuiles toujours fixes, sans GIF ni vidéo de fond. Pratique aussi si, sur Nuvio TV avec « Arrière-plan en plein écran », les tuiles disparaissent quelques secondes quand tu t'arrêtes dessus.";
for (const n of NOUVEAUTES) {
  if (!Array.isArray(n.points)) continue;
  n.points = n.points.map((p) => (typeof p === "string" && p.includes("« Vidéo de fond des tuiles »") && p.includes("« Tuiles animées »") ? NOUVEAUTE_TUILES : p));
}
