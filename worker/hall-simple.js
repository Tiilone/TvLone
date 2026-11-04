// Hall de cette copie (ajout propre à cette copie, absent du dépôt d'origine) : sans le jeu « Le film du jour »
// et sans le bouton « Voir l'accueil que tu auras à la fin » (seul « Avant / après le guide » reste). Le secret
// « Deviner le film du jour » et l'onglet « Billets » des secrets sont retirés dans stage.js. Les deux portes se
// choisissent selon ce qu'on a déjà installé (Nuvio seul ne lit rien sans Lumio), pas selon l'appli. Si la page
// d'origine change de forme, elle reste telle quelle.

const BILLET = /\s*<a class="film-du-jour"[^]*?<\/a>/;
const APERCU = /\s*<button type="button" class="apercu-lien" data-resultat>[^<]*(?:<(?!\/button>)[^<]*)*<\/button>/;

const PORTES = [
  ["<b>Je n'ai pas encore Nuvio</b><small>Le guide de A à Z : on installe tout, dans l'ordre, sur TV, téléphone ou ordinateur. Environ 25 minutes.</small>",
    "<b>Je pars de zéro</b><small>Nuvio, AllDebrid, Lumio et le catalogue en français : on installe tout, dans l'ordre, sur TV, téléphone ou ordinateur. Environ 25 minutes.</small>"],
  ["<b>J'ai déjà Nuvio</b><small>Compose ton accueil : rangées, plateformes, filtres et collections, avec un aperçu en direct.</small>",
    "<b>Je suis déjà équipé</b><small>Nuvio et Lumio sont déjà installés ? Compose ton accueil : rangées, plateformes, filtres et collections, avec un aperçu en direct.</small>"],
];

/** Hall de cette copie : sans le jeu, sans le bouton d'aperçu de l'accueil, portes selon ce qu'on a installé. */
export function avecHallSimple(page) {
  page = page.replace(BILLET, "").replace(APERCU, "");
  for (const [avant, apres] of PORTES) page = page.split(avant).join(apres);
  return page;
}
