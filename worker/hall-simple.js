// Hall de cette copie (ajout propre à cette copie, absent du dépôt d'origine) : sans le jeu « Le film du jour »
// et sans le bouton « Voir l'accueil que tu auras à la fin » (seul « Avant / après le guide » reste). Le secret
// « Deviner le film du jour » et l'onglet « Billets » des secrets sont retirés dans stage.js. Les deux portes se
// choisissent selon ce qu'on a déjà installé (Nuvio seul ne lit rien sans Lumio), pas selon l'appli. Si la page
// d'origine change de forme, elle reste telle quelle.

const BILLET = /\s*<a class="film-du-jour"[^]*?<\/a>/;
const APERCU = /\s*<button type="button" class="apercu-lien" data-resultat>[^<]*(?:<(?!\/button>)[^<]*)*<\/button>/;

// Les portes sont repérées par leur numéro (plaque « Salle 1 », « Salle 2 »), pas par leur texte : le titre et la
// phrase sont remplacés quels qu'ils soient dans la page d'origine (tests/ma-copie.test.js vérifie qu'ils ont pris).
export const PORTES = {
  1: ["Je pars de zéro", "Nuvio, AllDebrid, Lumio et le catalogue en français : on installe tout, dans l'ordre, sur TV, téléphone ou ordinateur. Environ 25 minutes."],
  2: ["Je suis déjà équipé", "Nuvio et Lumio sont déjà installés ? Compose ton accueil : rangées, plateformes, filtres et collections, avec un aperçu en direct."],
};
const PORTE = /(<span class="plaque-porte">Salle (\d)<\/span>[^]*?<span class="texte"><b>)[^<]*(<\/b><small>)[^<]*(<\/small>)/g;

/** Hall de cette copie : sans le jeu, sans le bouton d'aperçu de l'accueil, portes selon ce qu'on a installé. */
export function avecHallSimple(page) {
  page = page.replace(BILLET, "").replace(APERCU, "");
  return page.replace(PORTE, (m, a, n, b, c) => (PORTES[n] ? a + PORTES[n][0] + b + PORTES[n][1] + c : m));
}
