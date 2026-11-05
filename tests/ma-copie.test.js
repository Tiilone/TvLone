// Personnalisations de cette copie (Tiilone/TvLone), absentes du dépôt d'origine : ce fichier vérifie qu'elles
// sont toujours en place, en particulier après un « Sync fork ». Il est lancé seul par .github/workflows/copie.yml
// (les tests du dépôt d'origine, eux, échouent exprès sur ce qui diffère dans cette copie).
// Quand un test échoue ici, une personnalisation a sauté : son nom dit laquelle.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import worker from "../worker/index.js";
import { contenuStatique } from "../worker/statique.js";
import { PORTES } from "../worker/hall-simple.js";

globalThis.caches = { default: { match: async () => undefined, put: async () => {} } };
globalThis.fetch = async (url) => new Response(String(url).endsWith("collections.json") ? "[]" : JSON.stringify({ results: [] }));
const O = "https://x.exemple";
const env = { TMDB_API_KEY: "x" }, ctx = { waitUntil() {} };
const page = async (p) => (await worker.fetch(new Request(O + p), env, ctx)).text();
const section = (html, id) => {
  const i = html.indexOf(`<section class="act" id="${id}">`);
  return i < 0 ? "" : html.slice(i, html.indexOf("</section>", i));
};
const scriptsEnLigne = (html) => [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);

test("copie_nom_du_worker", () => {
  assert.match(readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8"), /^name = "nuvio"$/m, "wrangler.toml : name = \"nuvio\"");
});

test("copie_hall", async () => {
  const html = await page("/");
  assert.doesNotMatch(html, /class="film-du-jour"/, "le billet « Le film du jour » est revenu dans le hall");
  assert.doesNotMatch(html, /class="apercu-lien" data-resultat>/, "le bouton « Voir l'accueil que tu auras à la fin » est revenu dans le hall");
  assert.match(html, /class="apercu-lien" data-resultat data-avant-apres/, "le bouton « Avant / après le guide » a disparu du hall");
  for (const [n, [titre, texte]] of Object.entries(PORTES)) {
    assert.ok(html.includes(`<b>${titre}</b><small>${texte}</small>`), `porte ${n} du hall : « ${titre} » n'est plus affiché`);
  }
});

test("copie_secrets_sans_film_du_jour_ni_billets", () => {
  const js = contenuStatique("scene.js");
  assert.doesNotMatch(js, /"Deviner le film du jour"/, "le secret « Deviner le film du jour » est revenu (stage.js)");
  assert.doesNotMatch(js, /\["billets", "Billets"\]/, "l'onglet « Billets » des secrets est revenu (stage.js)");
  assert.doesNotMatch(js, /billetDuJour\(b\), 4500/, "la carte « Ton billet du jour » est revenue (stage.js)");
});

test("copie_guide_etapes", async () => {
  const html = await page("/guide");
  const nums = [...html.matchAll(/<section class="act[^"]*" id="([^"]+)">\s*<header><span class="num">(\d+)<\/span>/g)].map((m) => m[1] + ":" + m[2]);
  assert.deepEqual(nums, ["avant:01", "installer:02", "francais:03", "telephone:04", "comptes:05", "addons:06", "reglages:07", "tester:08", "depannage:09"],
    "les étapes du guide ne sont plus les 9 attendues (collections, affiches et ranger retirées)");
  for (const id of ["collections", "affiches", "ranger"]) assert.ok(html.includes(`<div class="act nvs-cache" id="${id}" hidden>`), `étape « ${id} » plus retirée`);
  assert.match(html, /<span id="reel-total">09<\/span>/, "le total de la bobine n'est plus 09");
  assert.match(section(html, "reglages"), /<span class="label">Mise en scène<\/span>/, "l'étape des réglages n'est plus étiquetée « Mise en scène »");
});

test("copie_guide_haut_et_bas", async () => {
  const html = await page("/guide");
  assert.doesNotMatch(html, /class="raccourci"/, "le raccourci « Tu as déjà Nuvio ? Passe direct à la salle 2 » est revenu");
  assert.match(html, /class="voir-resultat" data-resultat>[\s\S]*?<\/svg>Aperçu de l'accueil que tu auras à la fin<\/button>/, "le bouton du haut n'est plus « Aperçu de l'accueil que tu auras à la fin »");
  assert.match(html, /<a class="sortie" href="https:\/\/x\.exemple\/">/, "« Sortie » ne mène plus au hall");
  assert.match(html, /<a class="sortie"[^>]*>[\s\S]*?<b>Sortie<\/b><span>Retour au hall<\/span>/, "« Sortie » n'affiche plus « Retour au hall »");
  assert.ok(html.includes("8522294") && !html.includes("5486412"), "le code Downloader n'est plus celui de cette copie (8522294)");
});

test("copie_guide_entracte_apres_etape_5", async () => {
  const html = await page("/guide");
  const fin5 = html.indexOf("</section>", html.indexOf('<section class="act" id="comptes">'));
  const apres = html.slice(fin5 + "</section>".length).trimStart();
  assert.ok(apres.startsWith('<aside class="entracte"'), "l'entracte n'est plus juste après l'étape 5");
  assert.doesNotMatch(html, /html\.nvs-on \.entracte/, "l'entracte est de nouveau masqué par le mode simple");
});

test("copie_guide_installer", async () => {
  const html = await page("/guide");
  const inst = section(html, "installer");
  assert.match(inst, /class="nvs-compte nvs-compte-tv"/, "encadré « Crée ton compte Nuvio » (TV, code QR) absent");
  assert.match(inst, /class="nvs-compte nvs-compte-autre"/, "encadré « Crée ton compte Nuvio » (téléphone, ordinateur) absent");
  const pc = inst.slice(inst.indexOf('id="panel-pc"'));
  assert.ok(inst.includes('id="panel-pc"') && !pc.includes("tu colles les liens directement dans l'appli"), "Windows/Linux : « tu colles les liens directement dans l'appli » est revenu");
});

test("copie_guide_sous_titres_francais_et_forces", async () => {
  const html = await page("/guide");
  assert.match(html, /<b>Langue préférée<\/b><\/span><span class="nv-val">Français/, "visite des réglages : la langue préférée des sous-titres n'est plus « Français »");
  assert.match(html, /Utiliser les sous-titres forcés : <b>activé<\/b>/, "visite des réglages : « Utiliser les sous-titres forcés » n'est plus activé");
  assert.match(html, /Sous-titres → Langue préférée → Français, et active <b>Utiliser les sous-titres forcés<\/b>/, "carte OpenSubtitles : la consigne n'est plus « Français » + « Utiliser les sous-titres forcés »");
});

test("copie_guide_tmdb_visuels", async () => {
  const html = await page("/guide");
  const ordre = ["Bandes-annonces", "Visuels", "Informations de base", "Détails"].map((n) => html.indexOf(`["${n}", "`));
  assert.ok(ordre.every((i) => i > 0) && ordre.every((i, k) => k === 0 || i > ordre[k - 1]), "étape 3, TMDB : la liste n'est plus « Bandes-annonces, Visuels, Informations de base, Détails »");
  assert.doesNotMatch(html, /\["Illustrations", "/, "étape 3, TMDB : « Illustrations » est revenu à la place de « Visuels »");
  assert.match(html, /<b>Visuels<\/b>/, "visite des réglages : « Visuels » absent de TMDB (reglages.js)");
  assert.match(await page("/configure"), /désactive aussi Bandes-annonces, Visuels, Informations de base et Détails/, "salle 2 : la consigne TMDB n'est plus à jour");
});

test("copie_gerer_depuis_le_telephone_chemin_complet", async () => {
  assert.match(section(await page("/guide"), "telephone"), /<span class="path">Contenu et découverte → Addons → Gérer depuis le téléphone<\/span>/, "étape 4 : « Contenu et découverte → » manque avant « Addons → Gérer depuis le téléphone »");
  assert.match(await page("/configure"), /Nuvio : Contenu et découverte → Addons → <b>Gérer depuis le téléphone<\/b>/, "salle 2 (sans compte) : « Contenu et découverte → » manque avant « Addons → Gérer depuis le téléphone »");
});

test("copie_guide_etape_6_intro_sans_copier_coller", async () => {
  const html = await page("/guide");
  const lead = (section(html, "addons").match(/<p class="lead">([\s\S]*?)<\/p>/) || [])[1] || "";
  assert.match(lead, /<b>Envoyer dans Nuvio<\/b> les installe tous d'un coup/, "étape 6 : l'intro ne parle plus de « Envoyer dans Nuvio »");
  assert.doesNotMatch(lead, /Ajouter un addon/, "étape 6 : l'intro dit de nouveau de coller chaque lien dans « Addons → Ajouter un addon »");
  assert.doesNotMatch(html, /<span class="path">Addons → /, "guide : un chemin « Addons → » sans « Contenu et découverte → »");
});

// L'étape 6 (une carte par addon, aperçu de l'accueil, envoi dans Nuvio) est construite dans le navigateur par le
// code de guide-simple.js : on vérifie que ce code est là et que les repères qu'il cherche existent encore.
test("copie_guide_etape_6_reperes", async () => {
  const html = await page("/guide");
  for (const s of scriptsEnLigne(html)) assert.doesNotThrow(() => new Function(s), "un script en ligne du guide ne se lit plus");
  for (const m of ["nvs-ecran", "nvs-outils", "Plein écran", "nvs-fin", "nvs-lien-champ", "nvs-lumio", "nvs-wastream", "nvs-os"]) assert.ok(html.includes(m), `code de l'étape 6 : « ${m} » absent`);
  const addons = section(html, "addons");
  const titres = [...addons.matchAll(/<article class="addon">[\s\S]*?<h3>([^<]*)/g)].map((m) => m[1].trim());
  for (const t of ["Catalogue FR", "Lumio", "WAStream", "OpenSubtitles"]) assert.ok(titres.some((x) => x.startsWith(t)), `carte « ${t} » introuvable à l'étape 6`);
  for (const r of ['class="perso-actions"', "data-perso-ouvrir", 'id="u-cat"', "data-consigne", "data-cle-ad"]) assert.ok(addons.includes(r), `repère « ${r} » absent de l'étape 6`);
  assert.match(html, /<a [^>]*data-compte-nuvio/, "lien « Tout envoyer dans Nuvio » (data-compte-nuvio) absent du guide");
  const nv = contenuStatique("nuvio.js");
  for (const f of ["const ecran = (hote", "ouvert()", "rangee", "pret", "retour", "paysage", "carte", "tuile", "reglages"]) assert.ok(nv.includes(f), `écran Nuvio (nuvio.js) : « ${f} » absent`);
});

test("copie_salle_2_mode_d_emploi", async () => {
  const html = await page("/configure");
  assert.match(html, /<p class="nvs-titre">Avec un compte Nuvio<\/p>/, "salle 2 : l'encadré « Mode d'emploi » n'est plus réécrit (salle2-simple.js)");
});

test("copie_salle_2_au_telephone", async () => {
  const html = await page("/configure");
  assert.match(html, /<nav class="nvm-barre" aria-label="Raccourcis">/, "salle 2 : la barre d'onglets du téléphone a disparu (salle2-mobile.js)");
  for (const o of ["ecran", "rangees", "collections", "ordre", "billet"]) assert.ok(html.includes(`data-nvm="${o}"`), `salle 2 : onglet « ${o} » absent`);
  assert.deepEqual([...html.matchAll(/data-nvm="([a-z]+)"/g)].map((m) => m[1]), ["ecran", "rangees", "collections", "ordre", "billet"], "salle 2 : les onglets du bas ne sont plus dans l'ordre Écran, Rangées, Collections, Ordre, Billet");
  assert.match(html, /\.nvm-poignee/, "salle 2 : le rangement au doigt (poignées) a disparu");
  assert.match(html, /\.nvm-poignee \{[^}]*touch-action: pan-y;/, "salle 2 : la poignée bloque de nouveau le défilement de la page au doigt");
  assert.match(html, /const APPUI = \d+;/, "salle 2 : au doigt, la rangée se soulève de nouveau sans appui maintenu");
  assert.match(html, /\n#rows \.arrow, \.acc-list \.arrow, \.tiles \.arrow \{ display: none; \}/, "salle 2 : les flèches haut / bas sont revenues (la poignée les remplace partout)");
  // Repères de la page d'origine dont se sert le rangement au doigt : listes, flèches, fenêtres, création de rangée.
  for (const r of ['id="rows"', 'id="accueil-ordre"', 'id="prov-ordre"', 'id="collections"', 'id="acc-ouvrir"', 'id="coll-ouvrir"', 'id="builder"', 'id="b-cancel"', 'id="stage"', 'id="ticket"', 'class="nav"']) assert.ok(html.includes(r), `salle 2 : repère « ${r} » absent`);
  for (const f of ["range-les avec les flèches", "monte ou descends chacune"]) assert.ok(html.includes(f), `salle 2 : consigne « ${f} » absente de la page d'origine (plus réécrite au doigt)`);
  assert.ok(contenuStatique("salle2.js").includes('[["↑", -1, "Monter"], ["↓", 1, "Descendre"]]'), "salle 2 (salle2.js) : les flèches ne s'appellent plus « Monter » / « Descendre », le rangement au doigt ne les trouve plus");
  for (const s of scriptsEnLigne(html)) assert.doesNotThrow(() => new Function(s), "un script en ligne de la salle 2 ne se lit plus");
});

test("copie_apercu_onglets_des_tops_nommes", () => {
  const js = contenuStatique("nuvio.js");
  assert.ok(js.includes('"Onglet " + (i + 1)') && js.includes("const manifeste = (base) =>") && js.includes("const nomType = (t) =>"),
    "aperçu (nuvio.js) : les onglets d'une tuile, le manifest ou nomType ont changé de forme, les tops s'appellent à nouveau « Onglet 1 »");
  assert.match(js, /manifeste\(base\)\.then\(\(man\) => \{\s*const c = [^;]+x\.id === src\.catalogId/, "aperçu : les onglets sans titre ne sont plus nommés comme dans Nuvio");
  assert.ok(js.includes('" (" + (src.type === "movie" ? "Films" : src.type === "series" ? "Séries"') && js.includes('" · " + src.genre'), "aperçu : le nom n'a plus la forme « Top Netflix (Films) · France »");
  assert.doesNotThrow(() => new Function(js), "aperçu (nuvio.js) ne se lit plus");
});

test("copie_envoi_dans_nuvio_avec_lumio", async () => {
  const html = await page("/compte-nuvio");
  for (const id of ["e-lumio", "e-wastream", "e-os", "lien-lumio", "lien-wastream"]) assert.ok(html.includes(`id="${id}"`), `/compte-nuvio : « ${id} » absent (compte-autres.js)`);
  assert.match(html, /const envoiAutre = async/, "/compte-nuvio : l'envoi de Lumio, WAStream et OpenSubtitles a disparu");
  for (const s of scriptsEnLigne(html)) assert.doesNotThrow(() => new Function(s), "un script en ligne de /compte-nuvio ne se lit plus");
});

test("copie_envoi_dans_nuvio_tuiles_animees_au_choix", async () => {
  const html = await page("/compte-nuvio");
  assert.match(html, /id="e-coll"[^]*?<\/label>\s*<label class="switch nvs-sous"><input type="checkbox" id="e-gifs" checked>/, "/compte-nuvio : l'interrupteur « Tuiles animées » n'est plus sous « Les collections » (envoi-gifs.js)");
  assert.match(html, /const liste = fusion\(avant, avecGifs\(nos\), /, "/compte-nuvio : les collections partent sans tenir compte de « Tuiles animées »");
  // Décoché : nos tuiles partent avec focusGifEnabled à false et sans vidéo de fond (l'image de fond reste) ; coché : telles quelles.
  const code = html.match(/const sansGifs = [^\n]+\n\s*const avecGifs = [^]*?: col\)\);/)[0];
  const essai = (coche) => new Function("$", code + "\nreturn avecGifs;")(() => ({ checked: coche }));
  const cols = [{ id: "p", folders: [{ id: "n", focusGifEnabled: true, focusGifUrl: "x.gif", heroVideoUrl: "x.mp4", heroBackdropUrl: "x.jpg" }, { id: "m" }] }, { id: "v" }];
  assert.deepEqual(essai(false)(cols).flatMap((c) => (c.folders || []).map((f) => f.focusGifEnabled)), [false, false]);
  const envoyee = JSON.parse(JSON.stringify(essai(false)(cols)))[0].folders[0];
  assert.equal(envoyee.focusGifUrl, "x.gif");
  assert.equal(envoyee.heroBackdropUrl, "x.jpg");
  assert.ok(!("heroVideoUrl" in envoyee), "/compte-nuvio : décoché, la vidéo de fond des tuiles part encore (Nuvio la joue)");
  assert.equal(essai(true)(cols), cols);
  for (const s of scriptsEnLigne(html)) assert.doesNotThrow(() => new Function(s), "un script en ligne de /compte-nuvio ne se lit plus");
});

test("copie_sans_renvoi_au_projet_d_origine", async () => {
  const copie = await worker.fetch(new Request(O + "/copie"), env, ctx);
  assert.equal(copie.status, 302, "/copie (« Monte ta propre salle ») est de nouveau accessible");
  assert.equal(copie.headers.get("Location"), O + "/", "/copie ne renvoie plus au hall");
  const etat = await page("/etat");
  assert.match(etat, /<p class="note">Les tests se refont/, "/etat ne s'affiche plus comme attendu");
  assert.doesNotMatch(etat, /github\.com\/[^"]+\/issues/, "/etat renvoie de nouveau vers la page des problèmes du projet d'origine");
});
