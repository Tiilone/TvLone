// Page « Tout envoyer dans Nuvio » (/compte-nuvio) : Lumio part avec le reste (ajout propre à cette copie, absent du
// dépôt d'origine). Une case « Lumio » et un champ pour son lien d'installation (perso : il contient la clé AllDebrid,
// gardé seulement dans ce navigateur, clé « nvs-lumio », la même que le guide). Lumio est rangé juste après le
// Catalogue FR ; les autres addons du compte restent. Si la page d'origine change de forme, elle reste telle quelle.

export const CLE_LUMIO = "nvs-lumio";

const CSS = `
.nvs-lumio[hidden] { display: none; }
.nvs-lumio { margin-top: 4px; }
`;

const CASE = `<label class="switch"><input type="checkbox" id="e-lumio" checked><span><b>Lumio</b><small>Ajouté juste après le Catalogue FR, avec ton lien Lumio ; tes autres addons restent.</small></span></label>`;

const CHAMP = `
    <div class="champ nvs-lumio" id="champ-lumio">
      <label for="lien-lumio">Ton lien Lumio</label>
      <input id="lien-lumio" type="url" inputmode="url" autocomplete="off" spellcheck="false" placeholder="https://mylumio.tv/…/manifest.json">
      <p class="aide">Pas encore de lien ? Ouvre <a href="https://mylumio.tv/configure" target="_blank" rel="noopener">la page de Lumio</a>, connecte AllDebrid, règle tes préférences selon ton appareil (<a href="/guide#addons" target="_blank" rel="noopener">voir le guide</a>), puis copie le lien d'installation (bouton en bas à droite) et colle-le ici. Gardé seulement dans ce navigateur.</p>
    </div>`;

// Code ajouté dans le script de la page, juste avant l'envoi des collections : il y trouve appelCompte, rpc et
// location.origin, comme l'envoi de l'addon.
const ENVOI = `
  // Lumio (ajout de cette copie) : son lien, en https, jusqu'à /manifest.json.
  const lienLumio = () => {
    let u = ($("lien-lumio").value || "").trim();
    if (!u) throw new Error("colle ton lien Lumio dans le champ au-dessus (ou décoche Lumio).");
    u = u.replace(/^stremio:\\/\\//i, "https://");
    let url;
    try { url = new URL(u); } catch (e) { throw new Error("ce lien Lumio n'est pas une adresse."); }
    if (url.protocol !== "https:" || !/\\/manifest\\.json$/.test(url.pathname)) throw new Error("le lien Lumio doit finir par /manifest.json (le lien d'installation de Lumio).");
    return url.href;
  };
  const envoiLumio = async (profil) => {
    const lien = lienLumio();
    // Le lien répond ? Une réponse d'erreur arrête tout ; un refus du navigateur (CORS) n'empêche pas l'envoi.
    let rep = null;
    try { rep = await fetch(lien); } catch (e) { /* injoignable d'ici : Nuvio, lui, le lira */ }
    if (rep && !rep.ok) throw new Error("Lumio ne répond pas à ce lien (réponse " + rep.status + ").");
    const hote = new URL(lien).host;
    const de = (u, f) => { try { return f(new URL(u)); } catch (e) { return false; } };
    const avant = await appelCompte("/rest/v1/addons?select=url,name,enabled,sort_order&profile_id=eq." + profil + "&order=sort_order.asc");
    const autres = (Array.isArray(avant) ? avant : []).filter((a) => a && a.url).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .filter((a) => !de(a.url, (x) => x.host === hote));
    const i = autres.findIndex((a) => de(a.url, (x) => x.origin === location.origin));
    autres.splice(i + 1, 0, { url: lien, enabled: true });
    const liste = autres.map((a, n) => ({ url: a.url, sort_order: n, enabled: a.enabled !== false, ...(a.name ? { name: a.name } : {}) }));
    await rpc("sync_push_addons", { p_addons: liste, p_profile_id: profil, p_origin_client_id: memo.client });
    return i < 0 ? "Lumio, en tête de tes addons" : "Lumio, juste après le Catalogue FR";
  };
`;

// Le champ suit la case et se souvient du lien (ancre #lumio=…, sinon ce navigateur).
const JS = `(() => {
  const c = document.getElementById("e-lumio"), champ = document.getElementById("champ-lumio"), l = document.getElementById("lien-lumio");
  if (!c || !champ || !l) return;
  const CLE = ${JSON.stringify(CLE_LUMIO)};
  let garde = ""; try { garde = localStorage.getItem(CLE) || ""; } catch (e) {}
  l.value = new URLSearchParams(location.hash.slice(1)).get("lumio") || garde;
  const suivre = () => { champ.hidden = !c.checked; };
  c.addEventListener("change", suivre); suivre();
  l.addEventListener("input", () => { try { localStorage.setItem(CLE, l.value.trim()); } catch (e) {} });
})();`;

/** Ajoute Lumio à la page /compte-nuvio. Page inchangée si un repère manque. */
export function avecLumio(page) {
  const reperes = {
    caseAddon: /(<label class="switch"><input type="checkbox" id="e-addon"[^]*?<\/label>)/,
    finCases: "</fieldset>",
    envoiColl: "  const envoiCollections = async",
    partieAddon: /(\["e-addon", "L'addon", [^\n]*\n)/,
  };
  if (!reperes.caseAddon.test(page) || !page.includes(reperes.finCases) || !page.includes(reperes.envoiColl) || !reperes.partieAddon.test(page)) return page;
  let out = page
    .replace(reperes.caseAddon, `$1\n      ${CASE}`)
    .replace(reperes.finCases, () => reperes.finCases + CHAMP)
    .replace(reperes.envoiColl, () => ENVOI + reperes.envoiColl)
    .replace(reperes.partieAddon, `$1      ["e-lumio", "Lumio", () => envoiLumio(+((opt && opt.dataset.addons) || memo.profil))],\n`);
  const j = out.lastIndexOf("</body>");
  const ajout = `<style>${CSS}</style><script>${JS}</script>`;
  return j < 0 ? out + ajout : out.slice(0, j) + ajout + out.slice(j);
}
