// Hall de cette copie (ajout propre à cette copie, absent du dépôt d'origine) : sans le jeu « Le film du jour »
// et sans le bouton « Voir l'accueil que tu auras à la fin » (seul « Avant / après le guide » reste). Le secret
// « Deviner le film du jour » et l'onglet « Billets » des secrets sont retirés dans stage.js. Si la page d'origine
// change de forme, elle reste telle quelle.

const BILLET = /\s*<a class="film-du-jour"[^]*?<\/a>/;
const APERCU = /\s*<button type="button" class="apercu-lien" data-resultat>[^<]*(?:<(?!\/button>)[^<]*)*<\/button>/;

/** Retire du hall le jeu « Le film du jour » et le bouton d'aperçu de l'accueil. */
export function avecHallSimple(page) {
  return page.replace(BILLET, "").replace(APERCU, "");
}
