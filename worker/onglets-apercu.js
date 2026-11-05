// Aperçu Nuvio du site : les onglets d'une tuile de collection portent le même nom que dans Nuvio (ajout propre à
// cette copie, absent du dépôt d'origine). Une source « addon » sans titre (les tops des plateformes) s'appelait
// « Onglet 1 », « Onglet 2 » ; Nuvio, lui, écrit le nom du catalogue, son type et son filtre :
// « Top Netflix (Films) · France ». Le nom est lu dans le manifest du lien (déjà gardé par l'aperçu).
// Si le script de l'aperçu change de forme dans le dépôt d'origine, il reste tel quel.

const BOUTON = /(const b = mkd\("button", null, src\.title \|\| "Onglet " \+ \(i \+ 1\)\);)/;

const NOMMER = ` if (!src.title && src.provider === "addon" && typeof manifeste === "function") manifeste(base).then((man) => {
        const c = ((man && man.catalogs) || []).find((x) => x.id === src.catalogId && x.type === src.type);
        if (c && c.name) b.textContent = c.name + " (" + (src.type === "movie" ? "Films" : src.type === "series" ? "Séries" : nomType(src.type)) + ")" + (src.genre ? " · " + src.genre : "");
      }).catch(() => {});`;

/** Le script nuvio.js, avec les onglets sans titre nommés comme dans Nuvio. */
export const avecOngletsNommes = (js) => (BOUTON.test(js) ? js.replace(BOUTON, (m) => m + NOMMER) : js);
