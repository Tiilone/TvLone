// Mode simple du guide (ajout propre à cette copie, absent du dépôt d'origine).
// Ajouté à la fin de la page /guide sans toucher à guide.js : ne garde à l'écran que les étapes et range
// les explications (le « pourquoi ») dans des bulles « ? », visibles au survol ou au toucher.
// Seul ce mode est proposé : le guide complet n'est plus accessible.

const CSS = `
html.nvs-on .secret, html.nvs-on #reclames, html.nvs-on #r-dots,
html.nvs-on .hero > p:not(.tagline):not(.nvs-barre) { display: none !important; }
html.nvs-on .act ol > li, html.nvs-on .act ul > li { margin-bottom: .45em; }
.nvs-envoi { margin: 14px 0 10px; }
.nvs-etapes { margin: 8px 0 4px; }
.nvs-etapes .consigne { margin: .4em 0 0; font-size: .9rem; }
.nvs-lien-champ { display: block; width: 100%; box-sizing: border-box; margin: 8px 0 2px; padding: 10px 12px; border-radius: 8px;
  border: 1.5px solid rgba(255, 207, 107, .45); background: rgba(0, 0, 0, .25); color: var(--cream, #f5ead8); font: 400 .9rem/1.3 var(--body, system-ui, sans-serif); }
.nvs-lien-champ:focus { outline: none; border-color: var(--bulb, #ffcf6b); }
.nvs-outils { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 0 0 12px; }
.nvs-outils .seg { display: inline-flex; border: 1px solid var(--seat); border-radius: 10px; overflow: hidden; }
.nvs-outils button { font: 700 .85rem var(--body); padding: 8px 14px; border: 0; background: var(--velvet); color: var(--dim); cursor: pointer; }
.nvs-outils .seg button + button { border-left: 1px solid var(--seat); }
.nvs-outils button[aria-pressed="true"] { background: var(--cream); color: var(--ink); }
.nvs-outils .pp, .nvs-outils .retour { border: 1px solid var(--seat); border-radius: 10px; }
.nvs-outils .retour { color: var(--cream); }
.nvs-outils .plein { border: 1px solid rgba(255, 207, 107, .6); border-radius: 10px; background: rgba(255, 207, 107, .1); color: var(--bulb); }
.nvs-plein { position: fixed; inset: 0; z-index: 86; display: grid; place-items: center; align-content: center; gap: 14px; padding: 16px; background: rgba(5, 3, 4, .97); }
.nvs-plein .nvs-ecran { width: min(1180px, calc(100vw - 32px), calc((100vh - 110px) * 16 / 9)); margin: 0; }
.nvs-plein .nvs-outils { margin: 0; }
.nvs-plein-x { position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; border-radius: 50%; border: 0; background: rgba(255, 255, 255, .1); color: #fff; font: 800 1.3rem/1 var(--body); cursor: pointer; }
#installer .nvs-compte-tv { display: none; }
#panel-tv:not([hidden]) ~ .nvs-compte-tv, #panel-fire:not([hidden]) ~ .nvs-compte-tv { display: block; }
#panel-tv:not([hidden]) ~ .nvs-compte-autre, #panel-fire:not([hidden]) ~ .nvs-compte-autre { display: none; }
.nvs-compte { margin-top: 18px; padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(255, 207, 107, .45); background: rgba(255, 207, 107, .07); }
.nvs-compte p { margin: 0; }
.nvs-compte p + p { margin-top: 6px; }
.nvs-ecran { position: relative; aspect-ratio: 16 / 9; margin: 10px 0 12px; border-radius: 8px; overflow: hidden; background: #0D0D0D;
  container-type: inline-size; box-shadow: 0 0 0 6px #050304, 0 0 0 8px #2b1820, 0 18px 40px rgba(0, 0, 0, .55); }
.nvs-cache-carte[hidden] { display: none !important; }
.nvs-case { display: flex; gap: 10px; align-items: center; margin: 8px 0; font-weight: 600; cursor: pointer; }
.nvs-case input { width: 1.2em; height: 1.2em; accent-color: var(--bulb, #ffcf6b); }
.nvs-fin .seance { margin-top: 14px; }
.nvs-envoyer { display: inline-block; padding: 12px 26px; border-radius: 999px; background: var(--bulb, #ffcf6b); color: var(--ink, #2a1a14) !important;
  font-weight: 800; font-size: 1.05rem; text-decoration: none !important; box-shadow: 0 6px 18px rgba(255, 207, 107, .25); }
.nvs-envoyer:hover { filter: brightness(1.06); }
.nvs-envoyer:focus-visible, .nvs-secondaire:focus-visible { outline: 2px solid var(--cream, #f5ead8); outline-offset: 3px; }
.nvs-option { font-size: .92rem; color: var(--dim, #b9a59c); }
.nvs-option .nvs-secondaire { all: unset; cursor: pointer; color: var(--bulb, #ffcf6b); text-decoration: underline; text-underline-offset: 3px; font-weight: 600; }
.nvs-puces { margin: .5em 0 .2em; padding-left: 1.3em; list-style: disc; }
.nvs-puces > li { margin: .25em 0 !important; padding: 0 !important; }
.nvs-puces > li::before { content: none !important; }
.nvs-barre { display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center; justify-content: center; margin: 14px 0 0; font-size: .95rem; color: var(--dim, #b9a59c); }
.nvs-bascule { font: inherit; font-weight: 600; color: var(--velvet, #170c12); background: var(--bulb, #ffcf6b); border: 0; border-radius: 999px; padding: 7px 16px; cursor: pointer; }
.nvs-bascule:focus-visible, .nvs-q:focus-visible { outline: 2px solid var(--cream, #f5ead8); outline-offset: 2px; }
.nvs-q { display: inline-grid; place-items: center; width: 1.35em; height: 1.35em; margin-left: .4em; padding: 0; vertical-align: .1em;
  font: 700 .8rem/1 var(--body, system-ui, sans-serif); color: var(--bulb, #ffcf6b); background: transparent;
  border: 1.5px solid currentColor; border-radius: 50%; cursor: help; opacity: .8; }
.nvs-q:hover, .nvs-q[aria-expanded="true"] { opacity: 1; background: rgba(255, 207, 107, .15); }
h2 .nvs-q, h3 .nvs-q { font-size: .75rem; vertical-align: .35em; }
.nvs-bulle { position: fixed; z-index: 96; max-width: min(360px, calc(100vw - 32px)); padding: 12px 14px; border-radius: 10px;
  background: var(--seat, #3d2230); color: var(--cream, #f5ead8); border: 1px solid rgba(255, 207, 107, .45);
  box-shadow: 0 10px 30px rgba(0, 0, 0, .5); font: 400 .9rem/1.45 var(--body, system-ui, sans-serif); text-align: left; }
.nvs-bulle[hidden] { display: none; }
.nvs-bulle p { margin: 0 0 .5em; } .nvs-bulle p:last-child { margin-bottom: 0; }
.nvs-bulle a { color: var(--bulb, #ffcf6b); }
`;

const JS = String.raw`(() => {
  // Le mode simple est le seul proposé : plus de bascule vers le guide complet (ancien choix oublié).
  const simple = true;
  try { localStorage.removeItem("nvs-mode"); } catch (e) {}

  // Rappel sous le titre.
  const hero = document.querySelector(".hero");
  if (hero) {
    const barre = document.createElement("p");
    barre.className = "nvs-barre";
    barre.innerHTML = '<span>Survole ou touche un <b>?</b> pour savoir pourquoi.</span>';
    const tag = hero.querySelector(".tagline");
    (tag || hero.lastElementChild).after(barre);
  }
  // Addons non retenus sur cette copie (StreamFusion, Torrentio) : cartes masquées (pas supprimées, la page
  // met encore à jour leurs champs) et mentions retirées des textes, dans les deux modes.
  try {
    document.querySelectorAll("article.addon").forEach((a) => {
      const h = a.querySelector("h3");
      if (h && /^\s*(StreamFusion|Torrentio)/i.test(h.textContent)) a.style.display = "none";
    });
    const MENTIONS = [
      [/Lumio, StreamFusion, Torrentio et WAStream/g, "Lumio et WAStream"],
      [/Lumio, StreamFusion, Torrentio, WAStream/g, "Lumio, WAStream"],
      [/le guide la met tout seul dans le lien de Torrentio, et la garde sous la main pour les autres addons de sources/g, "le guide la garde sous la main pour les addons de sources"],
      [/Le guide s'en sert pour préparer le lien de Torrentio et te dire quoi cocher dans les autres addons/g, "Le guide s'en sert pour te dire quoi cocher dans les addons"],
      [/Torrentio et les autres addons donnent/g, "les addons de sources donnent"],
    ];
    // Étape 2 : pas d'installation « Avec Claude », seulement à la main (sélecteur, volets et badges masqués).
    document.querySelectorAll("#installer .modes, #installer .claude-dispo").forEach((e) => { e.style.display = "none"; });
    document.querySelectorAll('#installer .mode-pane[data-pane="claude"]').forEach((e) => { e.hidden = true; e.style.display = "none"; });
    document.querySelectorAll('#installer .mode-pane[data-pane="main"]').forEach((e) => { e.hidden = false; });

    // Seul AllDebrid est proposé : « Real-Debrid ou TorBox marchent aussi. » disparaît.
    document.querySelectorAll('a[href*="real-debrid.com"]').forEach((rd) => {
      const tb = rd.parentElement && rd.parentElement.querySelector('a[href*="torbox.app"]');
      const fin = tb && tb.nextSibling;
      if (!fin || fin.nodeType !== 3 || !/^\s*marchent aussi\.?/.test(fin.nodeValue)) return;
      let n = rd;
      while (n && n !== tb) { const s = n.nextSibling; n.remove(); n = s; }
      tb.remove();
      fin.nodeValue = fin.nodeValue.replace(/^\s*marchent aussi\.?/, "");
      const avant = fin.previousSibling;
      if (avant && avant.nodeType === 3) avant.nodeValue = avant.nodeValue.replace(/\s+$/, "");
    });
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode()); ) {
      if (!/StreamFusion|Torrentio/.test(n.nodeValue) || n.parentElement.closest("script,style")) continue;
      let v = n.nodeValue;
      MENTIONS.forEach(([re, par]) => { v = v.replace(re, par); });
      if (v !== n.nodeValue) n.nodeValue = v;
    }
  } catch (e) { console.warn("Mode simple du guide :", e); }

  // La liste à puces des réglages TMDB vaut pour les deux modes ; le reste seulement pour le mode simple.
  if (simple) document.documentElement.classList.add("nvs-on");

  // Ce qui ne doit jamais bouger : éléments interactifs ou mis à jour par la page.
  const ACTION = "button,input,select,textarea,code,.copy,.path,.pick,[id],[data-copy],[hidden],[data-consigne],form,canvas,svg";
  const HORS = "li,details,summary,header,.nv,.pupitre,.photo-diag,.trousseau,.reclames,.entracte,.copy,.cle-ad,.modes,.salle2,.qr-modal,.nvs-bulle,.addon-perso,.seance,.nvs-compte";
  const VERBES = /^(?:puis |ensuite |enfin )?(?:[^,:.]{1,45}, )?(?:puis |ensuite )?(ouvre|choisis|copie|colle|active|désactive|appuie|tape|installe|va|mets|règle|clique|coche|décoche|vérifie|exclus|scanne|note|autorise|accepte|garde|laisse|fais|déplace|supprime|retire|remets|ajoute|sélectionne|prends|passe|crée|confirme|renseigne|maintiens|dicte|lance|relance|force|regarde|réinstalle|entre|saisis|valide|connecte|associe|télécharge|glisse|double-clic|réponds|envoie|suis|recopie|limite|baisse|évite|utilise|cherche|ferme|redémarre|reviens|attends|change|mets-la|colle-la|copie-la|active-le|ouvre-la|ouvre-le)\b/i;

  const estAction = (el) => el.matches(ACTION) || !!el.querySelector(ACTION);
  const texte = (s) => (s || "").replace(/\s+/g, " ").trim();
  const imperatif = (s) => VERBES.test(texte(s));

  // Bulle partagée.
  const bulle = document.createElement("div");
  bulle.className = "nvs-bulle"; bulle.setAttribute("role", "tooltip"); bulle.id = "nvs-bulle"; bulle.hidden = true;
  document.body.appendChild(bulle);
  let ouvert = null, epingle = false;
  const placer = (btn) => {
    const r = btn.getBoundingClientRect();
    bulle.style.left = "0px"; bulle.style.top = "0px";
    const b = bulle.getBoundingClientRect();
    let x = r.left + r.width / 2 - b.width / 2;
    x = Math.max(16, Math.min(x, innerWidth - b.width - 16));
    let y = r.bottom + 8;
    if (y + b.height > innerHeight - 8 && r.top - b.height - 8 > 8) y = r.top - b.height - 8;
    bulle.style.left = x + "px"; bulle.style.top = y + "px";
  };
  const montrer = (btn) => {
    if (ouvert && ouvert !== btn) ouvert.setAttribute("aria-expanded", "false");
    ouvert = btn; btn.setAttribute("aria-expanded", "true");
    bulle.innerHTML = btn._nvs.join("");
    bulle.hidden = false; placer(btn);
  };
  const cacher = () => {
    if (ouvert) ouvert.setAttribute("aria-expanded", "false");
    ouvert = null; epingle = false; bulle.hidden = true;
  };
  bulle.addEventListener("mouseenter", () => { clearTimeout(bulle._t); });
  bulle.addEventListener("mouseleave", () => { if (!epingle) cacher(); });
  document.addEventListener("click", (e) => { if (ouvert && !e.target.closest(".nvs-q,.nvs-bulle")) cacher(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cacher(); });
  addEventListener("scroll", () => { if (ouvert) placer(ouvert); }, { passive: true });
  addEventListener("resize", () => { if (ouvert) placer(ouvert); });

  const bouton = () => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "nvs-q"; b.textContent = "?";
    b.setAttribute("aria-label", "Pourquoi ?"); b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-describedby", "nvs-bulle");
    b._nvs = [];
    b.addEventListener("mouseenter", () => { if (!epingle) montrer(b); });
    b.addEventListener("mouseleave", () => { if (!epingle) bulle._t = setTimeout(() => { if (!epingle && !bulle.matches(":hover")) cacher(); }, 150); });
    b.addEventListener("focus", () => { if (!epingle) montrer(b); });
    b.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      if (ouvert === b && epingle) cacher(); else { montrer(b); epingle = true; }
    });
    return b;
  };
  const ajouter = (cible, html) => {
    let b = cible.querySelector(":scope > .nvs-q");
    if (!b) { b = bouton(); cible.appendChild(b); }
    b._nvs.push(html);
  };

  // Titre auquel rattacher une explication : le titre précédent le plus proche, sinon celui de la carte ou de l'étape.
  const titreDe = (el) => {
    let n = el;
    while (n && !n.matches("section.act")) {
      let s = n.previousElementSibling;
      while (s) {
        if (s.matches("h2,h3,h4")) return s;
        if (s.matches("header")) { const h = s.querySelector("h2,h3,h4"); if (h) return h; }
        s = s.previousElementSibling;
      }
      n = n.parentElement;
    }
    return n ? n.querySelector("header h2") : null;
  };

  try {
    // 0. Étape 3, réglages TMDB : les cases à décocher en liste à puces, chacune avec son « pourquoi ».
    // Seulement si l'étape contient toujours les quatre réglages (sinon l'original reste tel quel).
    document.querySelectorAll("#francais li").forEach((li) => {
      const t = texte(li.textContent);
      if (!/Intégrations\s*→\s*TMDB/.test(t) || !["Bandes-annonces", "Informations de base", "Détails", "Illustrations"].every((m) => t.includes(m))) return;
      const chemin = li.querySelector(".path");
      li.textContent = "";
      if (chemin) li.appendChild(chemin);
      li.appendChild(document.createTextNode(" : "));
      const b = document.createElement("b"); b.textContent = "Langue → Français"; li.appendChild(b);
      li.appendChild(document.createTextNode(", puis désactive :"));
      const ul = document.createElement("ul");
      ul.className = "nvs-puces";
      [
        ["Bandes-annonces", "Activé, Nuvio prend celles de TMDB, souvent en anglais, à la place de celles du Catalogue FR, qui sont en VF dès qu'une VF existe."],
        ["Informations de base", "Pour voir quand arrivent les films à venir (« 📅 Dispo le 17 nov. » en tête du résumé)."],
        ["Détails", "Pour garder « Entre deux saisons » sur les séries en pause (sinon Nuvio met « En cours »)."],
        ["Illustrations", "Pour garder les fonds en pleine définition et les logos en français du Catalogue FR."],
      ].forEach(([nom, pourquoi]) => {
        const item = document.createElement("li");
        const g = document.createElement("b"); g.textContent = nom; item.appendChild(g);
        const q = bouton(); q._nvs.push("<p>" + pourquoi + "</p>"); item.appendChild(q);
        ul.appendChild(item);
      });
      li.appendChild(ul);
    });

    // Le sommaire de la bobine copie l'adresse de « Sortie » (désormais le hall) pour « Ta programmation (salle 2) » :
    // il reprend celle du lien « Salle 2 » de la page.
    {
      const home = document.querySelector("#reel-menu a.home"), s2 = document.querySelector(".salles a[data-programmation]");
      if (home && s2) home.href = s2.href;
    }

    // Étape 6 : une carte par addon, puis une carte « Envoyer dans Nuvio » qui envoie tout d'un coup (page /compte-nuvio,
    // voir worker/compte-autres.js). Les liens perso (Lumio, WAStream) sont collés dans leur carte et gardés dans ce
    // navigateur, sous les clés que la page d'envoi reprend. Sans lien, l'addon est laissé de côté. Le contenu
    // d'origine des cartes reste dans la page, masqué, pas supprimé : la page le tient encore à jour.
    (() => {
      const cartes = [...document.querySelectorAll("#addons article.addon")];
      const carte = (re) => cartes.find((x) => re.test((x.querySelector("h3") || {}).textContent || ""));
      const cat = carte(/^\s*Catalogue FR/), envoi = document.querySelector("a[data-compte-nuvio]");
      if (!cat || !envoi || !cat.querySelector(".perso-actions")) return;
      const lu = (k) => { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } };
      const garde = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
      const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
      const avance = (a) => {
        const d = el("div", "nvs-cache-carte"); d.hidden = true;
        [...a.children].forEach((c) => { if (!c.matches("header")) d.appendChild(c); });
        return d;
      };
      const bulle = (cible, html, avant) => { const q = bouton(); q._nvs.push(html); cible.insertBefore(q, avant || null); };
      let resume = () => {};

      // 1. Catalogue FR : son lien (les réglages conseillés, ou le lien perso), et la personnalisation en option.
      {
        const perso = cat.querySelector(".perso-actions [data-perso-ouvrir]");
        const seance = cat.querySelector("#seance");
        const intro = el("p", "nvs-cat");
        const code = document.getElementById("u-cat");
        const lienCat = () => ((code && code.textContent.trim()) || location.origin + "/manifest.json");
        const estPerso = () => lienCat() !== location.origin + "/manifest.json";
        const texteIntro = () => { intro.innerHTML = (estPerso() ? "Ton accueil Nuvio, <b>avec ta personnalisation</b>" : "Ton accueil Nuvio, avec les <b>réglages conseillés</b>") + " : rien à faire ici, il part avec le bouton <b>Envoyer dans Nuvio</b> de l'étape 5."; };
        texteIntro();
        const ecran = el("div", "nvs-ecran");
        ecran.setAttribute("aria-label", "Aperçu de ton accueil Nuvio");
        let E = null, dessine = "";
        const dessiner = async () => {
          const lien = lienCat();
          if (!window.NV || !NV.ecran || lien === dessine) return;
          dessine = lien; texteIntro(); etats();
          const base = lien.replace(/\/manifest\.json$/, "");
          if (E && E.hero && E.hero.stopVideo) E.hero.stopVideo();
          ecran.textContent = "";
          const focus = document.activeElement;
          E = NV.ecran(ecran, { base: () => base }); E.paysage(NV.reglages.format === "l"); E.pp();
          const tuiles = (c) => { const { piste } = E.rangee(c.title); (c.folders || []).forEach((t) => piste.append(NV.tuile(t, c.title, c.id))); };
          // Comme l'aperçu de la salle 2 (page.js, renderScreen) : toutes les rangées d'accueil (rangées sur mesure
          // comprises), dans l'ordre de l'accueil choisi (/accueil.json) ; sans lui, Plateformes, les rangées, les collections.
          const json = (u) => fetch(u).then((r) => (r.ok ? r.json() : null)).catch(() => null);
          try {
            const [manifest, colls, acc] = await Promise.all([fetch(base + "/manifest.json").then((r) => r.json()), json(base + "/collections.json"), json(base + "/accueil.json")]);
            if (dessine !== lien) return;
            const collections = Array.isArray(colls) ? colls : ((colls && colls.collections) || []);
            const accueil = (manifest.catalogs || []).filter((c) => c.showInHome !== false && !(c.extra || []).some((x) => x.isRequired));
            const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); e.target._charge(); } }), { root: E.rangees, rootMargin: "300px 0px" });
            const rangeeCatalogue = (c) => {
              const { section, piste } = E.rangee(c.name);
              for (let k = 0; k < 8; k++) piste.append(NV.carte(null));
              section._charge = () => fetch(base + "/catalog/" + c.type + "/" + encodeURIComponent(c.id) + ".json").then((x) => x.json()).then((d) => {
                if (dessine !== lien) return;
                const metas = (d.metas || []).filter((m) => m.poster);
                piste.textContent = "";
                if (!metas.length) { section.remove(); return; }
                metas.slice(0, 20).forEach((m) => piste.append(NV.carte(m)));
              }).catch(() => section.remove());
              io.observe(section);
            };
            const ordre = acc && Array.isArray(acc.ordre) ? acc.ordre : null;
            if (ordre) ordre.forEach((o) => {
              const c = o.collection ? collections.find((x) => x.id === o.collection) : accueil.find((x) => x.type === o.type && x.id === o.id);
              if (c) (o.collection ? tuiles : rangeeCatalogue)(c);
            });
            else {
              collections.filter((c) => c.pinToTop).forEach(tuiles);
              accueil.forEach(rangeeCatalogue);
              collections.filter((c) => !c.pinToTop).forEach(tuiles);
            }
            if (!E.rangees.children.length) { const { piste } = E.rangee("Écran noir"); piste.append(NV.mkd("p", "vide", "Aucune rangée ni collection : coche-en au moins une en personnalisant ton catalogue.")); }
            E.pret();
            if (ecran.querySelector(".nvo-menu")) E.retour();   // le menu, ouvert de lui-même, cacherait l'accueil
          } catch (e) {
            const { piste } = E.rangee("Aperçu indisponible"); piste.append(NV.mkd("p", "vide", "Vérifie ta connexion et réessaie."));
          }
          // L'aperçu ne prend pas le focus de la page (champ en cours de saisie…).
          if (focus && focus.isConnected && !ecran.contains(focus)) focus.focus({ preventScroll: true });
        };
        // Dessiné quand la carte arrive à l'écran ; redessiné quand le lien change (personnalisation).
        let vu = false;
        if ("IntersectionObserver" in window) new IntersectionObserver((es, o) => { if (es.some((e) => e.isIntersecting)) { o.disconnect(); vu = true; dessiner(); } }, { rootMargin: "200px 0px" }).observe(ecran);
        else { vu = true; setTimeout(dessiner, 0); }
        if (code) new MutationObserver(() => { if (vu) dessiner(); else texteIntro(); }).observe(code, { childList: true, characterData: true, subtree: true });
        // Sous l'écran, comme l'aperçu du hall : la télécommande (Retour) et les réglages d'affichage.
        const outils = el("div", "nvs-outils"), seg = el("div", "seg");
        const bRet = el("button", "retour", "◀ Retour"), bV = el("button", null, "Affiches verticales"), bP = el("button", null, "Paysage"), bPP = el("button", "pp", "Affiches maison");
        [bRet, bV, bP, bPP].forEach((b) => { b.type = "button"; });
        bRet.title = "Le bouton Retour de la télécommande (touche Échap ou Retour arrière dans l'aperçu)";
        const etats = () => { if (!window.NV) return; bV.setAttribute("aria-pressed", String(NV.reglages.format === "p")); bP.setAttribute("aria-pressed", String(NV.reglages.format === "l")); bPP.setAttribute("aria-pressed", String(!!NV.reglages.pp)); };
        bRet.addEventListener("click", () => { if (E) E.retour(); });
        bV.addEventListener("click", () => { NV.reglages.format = "p"; etats(); if (E) E.paysage(false); });
        bP.addEventListener("click", () => { NV.reglages.format = "l"; etats(); if (E) E.paysage(true); });
        bPP.addEventListener("click", () => { NV.reglages.pp = !NV.reglages.pp; etats(); if (E) E.pp(); if (window.sfx) sfx.click(); });
        // Plein écran : l'écran et sa barre passent dans une fenêtre par-dessus la page, puis reviennent à leur place.
        const bPlein = el("button", "plein", "⛶ Plein écran"); bPlein.type = "button";
        let plein = null;
        const fermerPlein = () => {
          if (!plein) return;
          const { ov, ici, avant } = plein; plein = null;
          ici.after(ecran, outils); ici.remove(); ov.remove();
          document.documentElement.style.overflow = "";
          bPlein.textContent = "⛶ Plein écran";
          (avant && avant.isConnected ? avant : bPlein).focus({ preventScroll: true });
        };
        const ouvrirPlein = () => {
          const ov = el("div", "nvs-plein"), ici = document.createComment("aperçu"), x = el("button", "nvs-plein-x", "×");
          x.type = "button"; x.setAttribute("aria-label", "Fermer le plein écran");
          ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Aperçu de ton accueil Nuvio");
          plein = { ov, ici, avant: document.activeElement };
          ecran.before(ici); ov.append(x, ecran, outils); document.body.appendChild(ov);
          document.documentElement.style.overflow = "hidden";
          bPlein.textContent = "Quitter le plein écran";
          x.addEventListener("click", fermerPlein);
          ov.addEventListener("click", (e) => { if (e.target === ov) fermerPlein(); });
          ov.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); if (E && E.ouvert && E.ouvert()) E.retour(); else fermerPlein(); } });
          if (!vu) { vu = true; dessiner(); }
          x.focus();
        };
        bPlein.addEventListener("click", () => (plein ? fermerPlein() : ouvrirPlein()));
        seg.append(bV, bP); outils.append(bRet, seg, bPP, bPlein);
        ecran.addEventListener("keydown", (e) => {
          if (!E || e.target.matches("input, textarea")) return;
          if (e.key === "Escape" && plein && !(E.ouvert && E.ouvert())) return;   // la fenêtre se ferme
          if (e.key === "Escape" || e.key === "Backspace") { e.preventDefault(); e.stopPropagation(); E.retour(); }
        });
        bulle(intro, "<p>Les rangées d'accueil en français (saison, tendances, nouveautés sur tes plateformes…), les catalogues de Découvrir, la recherche et les fiches des films et séries, avec les collections et les affiches.</p>");
        const option = el("p", "nvs-option", "<b>Facultatif</b> · choisir tes rangées, tes plateformes et tes filtres : ");
        if (perso) { perso.textContent = "Personnaliser mon catalogue"; perso.classList.add("nvs-secondaire"); option.appendChild(perso); }
        const d = avance(cat);
        if (seance) seance.remove();
        cat.append(intro, ecran, outils, option, d);
        cat._nvsSeance = seance;
      }

      // 2 et 3. Lumio, WAStream : leur page, les réglages pour ton appareil, puis le champ du lien.
      const avecLien = (a, cle, nom, exemple) => {
        if (!a) return;
        const page = (a.querySelector("ol a[href]") || {}).href || "";
        const reglages = a.querySelector("[data-consigne]"), cleAd = a.querySelector("[data-cle-ad]");
        const d = avance(a);
        const ol = el("ol", "nvs-cat nvs-etapes",
          "<li>Ouvre " + (page ? "<a href=\"" + page + "\" target=\"_blank\" rel=\"noopener\">la page de " + nom + "</a>" : "la page de " + nom) + ", connecte AllDebrid (clé API ou code) et règle tes préférences selon ton appareil.</li>"
          + "<li>Copie le lien d'installation de " + nom + " et colle-le ici :"
          + "<input type=\"url\" class=\"nvs-lien-champ\" inputmode=\"url\" autocomplete=\"off\" spellcheck=\"false\" placeholder=\"" + exemple + "\" aria-label=\"Ton lien " + nom + "\"></li>");
        const [l1, l2] = ol.children, champ = ol.querySelector("input");
        bulle(l1, "<p>Exclus les qualités et formats que ton appareil ne sait pas lire : sinon écran vert ou violet, image saccadée ou pas de son.</p>");
        if (reglages) l1.appendChild(reglages);
        if (cleAd) l1.appendChild(cleAd);
        bulle(l2, "<p>Ce lien contient ta clé AllDebrid : il reste dans ce navigateur, pour l'envoi de l'étape 5. Pas de lien ? " + nom + " est laissé de côté.</p>", champ);
        champ.value = lu(cle);
        champ.addEventListener("input", () => { garde(cle, champ.value.trim()); resume(); });
        a.append(ol, d);
      };
      avecLien(carte(/^\s*Lumio/), "nvs-lumio", "Lumio", "https://mylumio.tv/…/manifest.json");
      avecLien(carte(/^\s*WAStream/), "nvs-wastream", "WAStream", "https://wastream.noplay.fr/…/manifest.json");

      // 4. OpenSubtitles : un lien commun à tous, envoyé si la case est cochée.
      const os = carte(/^\s*OpenSubtitles/);
      if (os) {
        const d = avance(os);
        const p = el("label", "nvs-case", "<input type=\"checkbox\"> <span>Envoyer aussi OpenSubtitles (les sous-titres français)</span>");
        const c = p.querySelector("input");
        c.checked = lu("nvs-os") === "1";
        c.addEventListener("change", () => { garde("nvs-os", c.checked ? "1" : "0"); resume(); });
        const apres = el("p", "nvs-option", "Puis dans le lecteur : Paramètres → Sous-titres → Langue préférée → Forcé.");
        os.append(p, apres, d);
      }

      // 5. Envoyer dans Nuvio : ce qui part, le bouton, puis la vérification (le mot de passe de la séance).
      const fin = el("article", "addon nvs-fin", "<header><h3>Envoyer dans Nuvio</h3><span class=\"role\">Tout d'un coup</span></header>");
      const liste = el("p", "nvs-cat");
      resume = () => {
        const noms = ["Catalogue FR (avec ses collections et ses affiches)"];
        if (lu("nvs-lumio")) noms.push("Lumio");
        if (lu("nvs-wastream")) noms.push("WAStream");
        if (lu("nvs-os") === "1") noms.push("OpenSubtitles");
        liste.innerHTML = "Appuie sur <b>Envoyer dans Nuvio</b> et connecte ton compte Nuvio. Partira : <b>" + noms.join("</b>, <b>") + "</b>.";
      };
      resume();
      bulle(liste, "<p>Un addon sans lien est laissé de côté : colle son lien dans sa carte pour l'ajouter. Tes autres addons restent dans Nuvio.</p>");
      const zone = el("p", "nvs-envoi");
      envoi.textContent = "Envoyer dans Nuvio";
      envoi.className = "nvs-envoyer";
      zone.appendChild(envoi);
      fin.append(liste, zone);
      if (cat._nvsSeance) fin.appendChild(cat._nvsSeance);
      (os || cartes[cartes.length - 1]).after(fin);
    })();

    // Étape des réglages conseillés, version texte : le « Pourquoi » de chaque réglage passe dans un « ? »
    // (et l'explication d'un « À adapter » aussi, l'étiquette restant visible).
    document.querySelectorAll(".nv-texte .nvt-pourquoi, .nv-texte .nvt-adapt").forEach((tag) => {
      const bulle = document.createElement("span");
      let n = tag.nextSibling;
      while (n && !(n.nodeType === 1 && n.matches("ul,ol"))) { const s = n.nextSibling; bulle.appendChild(n); n = s; }
      if (!texte(bulle.textContent)) return;
      const q = bouton();
      q._nvs.push("<p>" + bulle.innerHTML.trim() + "</p>");
      if (tag.matches(".nvt-pourquoi")) { tag.replaceWith(q); }
      else { tag.after(q); }
      const avant = q.previousSibling;
      if (avant && avant.nodeType === 3) avant.nodeValue = avant.nodeValue.replace(/\s+$/, "");
    });

    if (!simple) return;

    // 1. Paragraphes d'explication : rangés dans le « ? » du titre.
    document.querySelectorAll("section.act p, section.act small, section.act .note").forEach((p) => {
      if (!p.isConnected || p.closest(HORS) || p.parentElement.closest("p")) return;
      // Rien à piocher dans ce qui est masqué sur cette copie (volets « Avec Claude », étapes retirées, addons retirés).
      if (p.closest('[data-pane="claude"], .nvs-cache, .nvs-cache-carte, article[style*="none"]')) return;
      if (p.matches(".warn,.consigne,.tagline,[class*=\"nvs-\"]") || p.hasAttribute("id")) return;   // nvs- : ajouts de ce mode, jamais rangés
      if ([...p.attributes].some((a) => a.name.startsWith("data-"))) return;
      if (estAction(p) || imperatif(p.textContent)) return;
      if (p.matches(".small") && p.nextElementSibling && p.nextElementSibling.matches(".copy")) return;
      if (texte(p.textContent).length < 25) return;
      const h = titreDe(p);
      if (!h) return;
      ajouter(h, "<p>" + p.innerHTML + "</p>");
      p.remove();
    });

    // 2. Dans chaque étape numérotée : on garde la consigne, les phrases d'explication passent dans un « ? ».
    const COUPE = /([.!?…])\s+(?=[A-ZÀÂÉÈÊÎÔÛÇ«(])/;
    document.querySelectorAll("section.act li").forEach((li) => {
      if (li.closest(".nvs-cache-carte,details,.nv,.pupitre,.photo-diag,.trousseau,.reclames,.modes")) return;
      if (li.querySelector("button,input,select,textarea,code,.copy,[id],[data-copy],[hidden],ol,ul")) return;
      // Découpe en phrases sans casser les éléments (liens, gras, chemins).
      const phrases = [[]];
      [...li.childNodes].forEach((n) => {
        if (n.nodeType !== 3) { phrases[phrases.length - 1].push(n); return; }
        let reste = n.textContent, m;
        while ((m = COUPE.exec(reste))) {
          const fin = m.index + m[1].length;
          phrases[phrases.length - 1].push(document.createTextNode(reste.slice(0, fin)));
          phrases.push([]);
          reste = reste.slice(fin).replace(/^\s+/, "");
        }
        if (reste) phrases[phrases.length - 1].push(document.createTextNode(reste));
      });
      if (phrases.length < 2) return;
      const garde = [], range = [];
      phrases.forEach((ph, i) => {
        const tmp = document.createElement("span");
        ph.forEach((n) => tmp.appendChild(n.nodeType === 3 ? n : n.cloneNode(true)));
        const t = texte(tmp.textContent);
        if (!t) return;
        const action = i === 0 || imperatif(t) || !!tmp.querySelector(".path,a,.pick");
        (action ? garde : range).push(ph);
      });
      // « Fais ceci : parce que… » : la justification après les deux-points part aussi dans la bulle.
      const RAISON = /\s:\s+((?:sinon|sans |activé|désactivé|il |elle |ils |elles |ça |c'est |le guide |nuvio |on |pas besoin )[\s\S]+)$/i;
      garde.forEach((ph) => {
        const der = ph[ph.length - 1];
        if (!der || der.nodeType !== 3) return;
        const m = RAISON.exec(der.textContent);
        if (!m) return;
        der.textContent = der.textContent.slice(0, m.index) + ".";
        const r = m[1].charAt(0).toUpperCase() + m[1].slice(1);
        range.unshift([document.createTextNode(r)]);
      });
      if (!range.length) return;
      li.textContent = "";
      garde.forEach((ph, i) => { if (i) li.appendChild(document.createTextNode(" ")); ph.forEach((n) => li.appendChild(n)); });
      const b = bouton(); li.appendChild(b);
      range.forEach((ph) => { const s = document.createElement("span"); ph.forEach((n) => s.appendChild(n)); b._nvs.push("<p>" + s.innerHTML + "</p>"); });
    });
  } catch (e) {
    console.warn("Mode simple du guide :", e);
  }
})();`;

export const GUIDE_SIMPLE = `<style>${CSS}</style><script>${JS}</script>`;

// Étapes retirées sur cette copie : « Tout envoyer dans Nuvio » (billet de la salle 2, ou étape 6) s'en charge,
// rangement de l'accueil compris.
const ETAPES_RETIREES = ["collections", "affiches", "ranger"];

/**
 * Retire des étapes avant que la page ne démarre : elles restent dans la page (cachées, hors de « section.act »)
 * pour que ses scripts trouvent encore leurs champs, mais la bobine, le sommaire et le diplôme ne les comptent
 * plus. Les numéros des étapes et les renvois « étape N » sont recalculés.
 */
function retirerEtapes(page) {
  const retires = [];
  for (const id of ETAPES_RETIREES) {
    const ouv = `<section class="act" id="${id}">`;
    const i = page.indexOf(ouv);
    if (i < 0) continue;
    const n = /<span class="num">(\d+)<\/span>/.exec(page.slice(i, i + 400));
    if (n) retires.push(Number(n[1]));
    // En <div class="act"> caché : hors de « section.act » (bobine, sommaire, diplôme), mais closest(".act")
    // le trouve encore (guide-fin.js, boutons QR à côté de chaque « Copier »).
    const fin = page.indexOf("</section>", i);
    if (fin < 0) continue;
    page = page.slice(0, i) + `<div class="act nvs-cache" id="${id}" hidden>` + page.slice(i + ouv.length, fin) + "</div>" + page.slice(fin + "</section>".length);
    page = page.replace(new RegExp(`<a href="#${id}">[^<]*</a>`), "");
  }
  if (!retires.length) return page;
  // Ancien numéro → nouveau ; une étape retirée renvoie à la précédente encore visible.
  const nouveau = (n) => {
    if (retires.includes(n)) { let p = n - 1; while (retires.includes(p)) p--; return nouveau(p); }
    return n - retires.filter((r) => r < n).length;
  };
  page = page.replace(/<section class="act[^"]*" id="[^"]+">\s*<header><span class="num">(\d+)<\/span>/g,
    (m, n) => m.replace(`>${n}<`, ">" + String(nouveau(Number(n))).padStart(n.length, "0") + "<"));
  page = page.replace(/([ée]tapes? )(\d{1,2})\b/g, (m, mot, n) => mot + nouveau(Number(n)));
  page = page.replace('<span id="reel-total">12</span>', `<span id="reel-total">${String(12 - retires.length).padStart(2, "0")}</span>`);
  return page;
}

// Code Downloader (raccourcisseur AFTVnews) de cette copie, à la place de celui du dépôt d'origine.
const DOWNLOADER_ORIGINE = "5486412", DOWNLOADER_COPIE = "8522294";

// Étape « Installer Nuvio » : créer son compte Nuvio et le connecter, ce qu'attend l'envoi de l'étape 6. Deux
// encadrés, l'un ou l'autre selon l'onglet (voir la CSS) : sur TV par code QR ; sur téléphone ou ordinateur,
// directement dans l'appli.
const COMPTE_SUITE = `<p class="small">C'est lui qui permet au bouton <b>Envoyer dans Nuvio</b> (étape 6) de tout installer d'un coup. Connecte <b>chaque appareil</b> (TV, téléphone, ordinateur) au <b>même compte</b>.</p>`;
const COMPTE_NUVIO = `
    <div class="nvs-compte nvs-compte-tv">
      <p><b>Crée ton compte Nuvio</b> (gratuit) et connecte-le : dans Nuvio sur ta TV, <span class="path">Paramètres → Compte → Connexion par code QR</span>, scanne le code avec ton téléphone et inscris-toi avec ton adresse e-mail (ou connecte-toi si tu as déjà un compte).</p>
      ${COMPTE_SUITE}
    </div>
    <div class="nvs-compte nvs-compte-autre">
      <p><b>Crée ton compte Nuvio</b> (gratuit) et connecte-le : dans Nuvio, <span class="path">Paramètres → Compte</span>, inscris-toi avec ton adresse e-mail (ou connecte-toi si tu as déjà un compte).</p>
      ${COMPTE_SUITE}
    </div>
  `;
// Sur ordinateur (Windows, Mac, Linux), « Ouvre Nuvio » suffit : pas de « tu colles les liens directement dans l'appli ».
const LIENS_APPLI = " : tu colles les liens directement dans l'appli.";
function avecCompteNuvio(page) {
  const i = page.indexOf('<section class="act" id="installer">');
  const fin = i < 0 ? -1 : page.indexOf("</section>", i);
  if (fin < 0) return page;
  const pc = page.indexOf('id="panel-pc"', i);
  const avant = pc < 0 || pc > fin ? page.slice(i, fin) : page.slice(i, pc) + page.slice(pc, fin).split(LIENS_APPLI).join(".");
  return page.slice(0, i) + avant + COMPTE_NUVIO + page.slice(fin);
}

// L'entracte (et sa vendeuse d'esquimaux, un secret de la salle) : juste après l'étape 5 (« Créer ta clé »), au
// milieu du guide de cette copie, plutôt qu'après les addons. Laissé à sa place si un repère manque.
function entracteApresEtape5(page) {
  const m = /\s*<aside class="entracte"[^]*?<\/aside>/.exec(page);
  const i = page.indexOf('<section class="act" id="comptes">');
  const fin = i < 0 ? -1 : page.indexOf("</section>", i);
  if (!m || fin < 0 || m.index < fin) return page;
  const sans = page.slice(0, m.index) + page.slice(m.index + m[0].length);
  const apres = fin + "</section>".length;
  return sans.slice(0, apres) + "\n" + m[0] + sans.slice(apres);
}

/** Ajoute le mode simple à la page du guide, juste avant </body>. */
export function avecModeSimple(page) {
  page = retirerEtapes(page);
  page = page.split(DOWNLOADER_ORIGINE).join(DOWNLOADER_COPIE);
  page = avecCompteNuvio(page);
  page = entracteApresEtape5(page);
  // Pas de raccourci « Tu as déjà Nuvio ? Passe direct à la salle 2 » : avoir Nuvio ne veut pas dire avoir les
  // addons (Lumio, WAStream…), le guide reste le chemin.
  page = page.replace(/\s*<a class="raccourci"[^>]*>[^<]*<\/a>/, "");
  // Le bouton du haut montre l'accueil conseillé, pas forcément celui qu'on aura après sa personnalisation.
  page = page.replace(/(<button type="button" class="voir-resultat" data-resultat>[^]*?)Voir l'accueil que tu auras à la fin<\/button>/, (m, debut) => debut + "Aperçu de l'accueil que tu auras à la fin</button>");
  // « Sortie », en bas du guide : vers le hall plutôt que vers la salle 2.
  page = page.replace(/<a class="sortie" href="([^"]*)\/configure" data-programmation>/, (m, o) => `<a class="sortie" href="${o}/">`)
    .replace("<span>Retour à ta programmation</span>", "<span>Retour au hall</span>");
  page = page.replace(/(<section class="act" id="reglages">\s*<header><span class="num">\d+<\/span><span class="label">)Réglages fins</, "$1Mise en scène<");
  const i = page.lastIndexOf("</body>");
  return i < 0 ? page + GUIDE_SIMPLE : page.slice(0, i) + GUIDE_SIMPLE + page.slice(i);
}
