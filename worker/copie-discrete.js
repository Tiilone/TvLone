// Cette copie ne renvoie pas vers le projet d'origine (ajout propre à cette copie, absent du dépôt d'origine) :
// pas de page « Monte ta propre salle » (/copie, qui mène au dépôt et à l'image Docker d'origine), et pas de lien
// vers la page des problèmes du projet d'origine sur /etat. Si la page /etat change de forme, elle reste telle quelle.

/** /copie : renvoie au hall. */
export const sansPageCopie = (url) => Response.redirect(url.origin + "/", 302);

// La phrase qui contient un lien vers les « issues » GitHub (« Un voyant orange ou rouge qui dure ? Dis-le sur … »).
const PHRASE_ISSUES = /\s[^.<>]*<a href="https:\/\/github\.com\/[^"]+\/issues">[^<]*<\/a>\./g;

/** /etat : sans le lien vers la page des problèmes du projet d'origine (la réponse JSON reste telle quelle). */
export async function etatSansLienProjet(reponse) {
  if (!/text\/html/.test(reponse.headers.get("Content-Type") || "")) return reponse;
  const texte = (await reponse.text()).replace(PHRASE_ISSUES, "");
  const headers = new Headers(reponse.headers);
  headers.delete("Content-Length");
  return new Response(texte, { status: reponse.status, statusText: reponse.statusText, headers });
}
