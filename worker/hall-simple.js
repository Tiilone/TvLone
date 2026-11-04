// Hall de cette copie (ajout propre à cette copie, absent du dépôt d'origine) : sans le jeu « Le film du jour ».
// Le billet vers /jeu est retiré de la page (le secret « Deviner le film du jour », lui, est retiré de la liste
// dans stage.js). Si la page d'origine change de forme, elle reste telle quelle.

const BILLET = /\s*<a class="film-du-jour"[^]*?<\/a>/;

/** Retire le jeu « Le film du jour » du hall. */
export function avecHallSimple(page) {
  return page.replace(BILLET, "");
}
