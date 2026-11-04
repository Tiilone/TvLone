// Page « Tout envoyer dans Nuvio » (/compte-nuvio) : les addons des étapes du guide (Lumio, WAStream, OpenSubtitles)
// partent avec le Catalogue FR (ajout propre à cette copie, absent du dépôt d'origine). Les liens de Lumio et WAStream
// sont perso (ils contiennent la clé AllDebrid) : collés dans le guide ou ici, gardés seulement dans ce navigateur
// (clés AUTRES_ADDONS[].cle, les mêmes que le guide). Sans lien, l'addon est laissé de côté : seul le Catalogue FR part.
// Rangés juste après le Catalogue FR, dans cet ordre ; les autres addons du compte restent. Si la page d'origine
// change de forme, elle reste telle quelle.

export const AUTRES_ADDONS = [
  { id: "lumio", nom: "Lumio", cle: "nvs-lumio", page: "https://mylumio.tv/configure", exemple: "https://mylumio.tv/…/manifest.json" },
  { id: "wastream", nom: "WAStream", cle: "nvs-wastream", page: "https://wastream.noplay.fr/configure", exemple: "https://wastream.noplay.fr/…/manifest.json" },
  { id: "os", nom: "OpenSubtitles", cle: "nvs-os", fixe: "https://opensubtitles-v3.strem.io/manifest.json" },
];

const CSS = `
.nvs-champ[hidden] { display: none; }
.nvs-champ { margin-top: 4px; }
`;

const CASES = AUTRES_ADDONS.map((a) => `<label class="switch"><input type="checkbox" id="e-${a.id}"><span><b>${a.nom}</b><small>${a.fixe
  ? "Les sous-titres français, juste après tes autres addons de cette liste."
  : `Avec ton lien ${a.nom} (ci-dessous), juste après le Catalogue FR ; sans lien, laissé de côté.`}</small></span></label>`).join("\n      ");

const CHAMPS = AUTRES_ADDONS.filter((a) => !a.fixe).map((a) => `
    <div class="champ nvs-champ" id="champ-${a.id}">
      <label for="lien-${a.id}">Ton lien ${a.nom} <small>(facultatif)</small></label>
      <input id="lien-${a.id}" type="url" inputmode="url" autocomplete="off" spellcheck="false" placeholder="${a.exemple}">
      <p class="aide">Ouvre <a href="${a.page}" target="_blank" rel="noopener">la page de ${a.nom}</a>, connecte AllDebrid, règle tes préférences selon ton appareil (<a href="/guide#addons" target="_blank" rel="noopener">voir le guide</a>), puis copie le lien d'installation et colle-le ici. Gardé seulement dans ce navigateur.</p>
    </div>`).join("");

// Code ajouté dans le script de la page, juste avant l'envoi des collections : il y trouve appelCompte, rpc, memo
// et location.origin, comme l'envoi de l'addon.
const ENVOI = `
  // Autres addons (ajout de cette copie) : leur lien, en https, jusqu'à /manifest.json.
  const AUTRES = ${JSON.stringify(AUTRES_ADDONS.map(({ id, nom, fixe }) => ({ id, nom, fixe: fixe || "" })))};
  const lienAutre = (a) => {
    if (a.fixe) return a.fixe;
    let u = ($("lien-" + a.id).value || "").trim();
    if (!u) throw new Error("colle ton lien " + a.nom + " dans son champ (ou décoche " + a.nom + ").");
    u = u.replace(/^stremio:\\/\\//i, "https://");
    let url;
    try { url = new URL(u); } catch (e) { throw new Error("ce lien " + a.nom + " n'est pas une adresse."); }
    if (url.protocol !== "https:" || !/\\/manifest\\.json$/.test(url.pathname)) throw new Error("le lien " + a.nom + " doit finir par /manifest.json (son lien d'installation).");
    return url.href;
  };
  const envoiAutre = async (id, profil) => {
    const a = AUTRES.find((x) => x.id === id);
    const lien = lienAutre(a);
    // Le lien répond ? Une réponse d'erreur arrête cet addon ; un refus du navigateur (CORS) n'empêche pas l'envoi.
    let rep = null;
    try { rep = await fetch(lien); } catch (e) { /* injoignable d'ici : Nuvio, lui, le lira */ }
    if (rep && !rep.ok) throw new Error(a.nom + " ne répond pas à ce lien (réponse " + rep.status + ").");
    const hote = (u) => { try { return new URL(u).host; } catch (e) { return ""; } };
    const h = hote(lien);
    // Juste après le Catalogue FR et les addons de cette liste rangés avant lui (Lumio avant WAStream…).
    const avantLui = new Set([location.host, ...AUTRES.slice(0, AUTRES.indexOf(a)).map((x) => x.fixe ? hote(x.fixe) : hote(($("lien-" + x.id).value || "").trim().replace(/^stremio:\\/\\//i, "https://")))].filter(Boolean));
    const avant = await appelCompte("/rest/v1/addons?select=url,name,enabled,sort_order&profile_id=eq." + profil + "&order=sort_order.asc");
    const autres = (Array.isArray(avant) ? avant : []).filter((x) => x && x.url).sort((x, y) => (x.sort_order || 0) - (y.sort_order || 0))
      .filter((x) => hote(x.url) !== h);
    let i = -1;
    autres.forEach((x, k) => { if (avantLui.has(hote(x.url))) i = k; });
    autres.splice(i + 1, 0, { url: lien, enabled: true });
    const liste = autres.map((x, n) => ({ url: x.url, sort_order: n, enabled: x.enabled !== false, ...(x.name ? { name: x.name } : {}) }));
    await rpc("sync_push_addons", { p_addons: liste, p_profile_id: profil, p_origin_client_id: memo.client });
    return a.nom + (i < 0 ? ", en tête de tes addons" : ", juste après le Catalogue FR");
  };
`;

const PARTIES = AUTRES_ADDONS.map((a) => `      ["e-${a.id}", ${JSON.stringify(a.nom)}, () => envoiAutre(${JSON.stringify(a.id)}, +((opt && opt.dataset.addons) || memo.profil))],\n`).join("");

// Cases et champs : repris du guide (ancre #lumio=…, sinon ce navigateur) ; une case suit son champ (cochée s'il y
// a un lien), et le lien est gardé à chaque frappe.
const JS = `(() => {
  const AUTRES = ${JSON.stringify(AUTRES_ADDONS.map(({ id, cle, fixe }) => ({ id, cle, fixe: !!fixe })))};
  const ancre = new URLSearchParams(location.hash.slice(1));
  const lu = (k) => { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } };
  const garde = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  AUTRES.forEach((a) => {
    const c = document.getElementById("e-" + a.id);
    if (!c) return;
    if (a.fixe) {
      c.checked = lu(a.cle) === "1";
      c.addEventListener("change", () => garde(a.cle, c.checked ? "1" : "0"));
      return;
    }
    const l = document.getElementById("lien-" + a.id);
    l.value = ancre.get(a.id) || lu(a.cle);
    c.checked = !!l.value.trim();
    l.addEventListener("input", () => { garde(a.cle, l.value.trim()); c.checked = !!l.value.trim(); });
  });
})();`;

/** Ajoute les autres addons du guide à la page /compte-nuvio. Page inchangée si un repère manque. */
export function avecAutresAddons(page) {
  const caseAddon = /<label class="switch"><input type="checkbox" id="e-addon"[^]*?<\/label>/;
  const finCases = "</fieldset>";
  const envoiColl = "  const envoiCollections = async";
  const partieAddon = /\["e-addon", "L'addon", [^\n]*\n/;
  if (!caseAddon.test(page) || !page.includes(finCases) || !page.includes(envoiColl) || !partieAddon.test(page)) return page;
  const out = page
    // La salle 2 ne s'ouvre que depuis le guide : pas de lien direct vers elle ici.
    .replace(/ · <a href="[^"]*\/configure">Ta programmation \(salle 2\)<\/a>/, "")
    .replace(caseAddon, (m) => m + "\n      " + CASES)
    .replace(finCases, () => finCases + CHAMPS)
    .replace(envoiColl, () => ENVOI + envoiColl)
    .replace(partieAddon, (m) => m + PARTIES);
  const j = out.lastIndexOf("</body>");
  const ajout = `<style>${CSS}</style><script>${JS}</script>`;
  return j < 0 ? out + ajout : out.slice(0, j) + ajout + out.slice(j);
}
