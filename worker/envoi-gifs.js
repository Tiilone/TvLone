// Page « Tout envoyer dans Nuvio » (/compte-nuvio) : un interrupteur « Tuiles animées » sous « Les collections »
// (ajout propre à cette copie, absent du dépôt d'origine). Coché (par défaut) : les collections partent telles
// quelles : une tuile sélectionnée s'anime (son GIF) et une vidéo joue en fond d'écran (heroVideoUrl). Décoché :
// chaque tuile part avec focusGifEnabled à false (l'interrupteur « GIF au focus » de Nuvio) et sans sa vidéo de fond
// (Nuvio n'a pas d'interrupteur pour elle ; il montre alors l'image de fond, heroBackdropUrl). Seules nos collections sont
// touchées (celles faites dans Nuvio restent telles quelles). Le choix est gardé dans ce navigateur.
// Si la page d'origine change de forme, elle reste telle quelle.

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
    ? { ...col, folders: col.folders.map((f) => (f && typeof f === "object" ? Object.assign({}, f, { focusGifEnabled: false, heroVideoUrl: undefined }) : f)) } : col));
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
